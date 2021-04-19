import time
import json
import atexit
from jsonschema import validate

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger, convert_to_datetime, datetime, get_localzone

from datetime import timedelta

from .utils import iso8601_duration_as_seconds as parse_duration, turn_on, turn_off_with_log, GPIO_Initialize, log_with_timestamp, GPIO_cleanup

from .models import PiConfig
from django.conf import settings

sched = BackgroundScheduler()
sched.start()


def update_status(running, config_id):
    f = open(settings.IRRIGATION_STATUS, 'w')
    json.dump({
        "running": running,
        "configId": config_id
    }, f)
    f.close()


update_status(False, None)


def cleanup():
    GPIO_cleanup()
    update_status(False, None)


atexit.register(cleanup)


def get_status():
    f = open(settings.IRRIGATION_STATUS, 'r')
    status = json.load(f)
    f.close()
    return status


def start_config(config_json):

    status = get_status()
    running = status.get('running', False)
    if running:
        config_id = status.get('configId', '')
        return {
            "error": f"Config: {config_id} is running",
            "status": status
        }

    f = open(settings.IRRIGATION_SCHEMA, "r")
    schema = json.load(f)
    f.close()

    validated_config = validate_config(json.loads(config_json), schema)

    logfile = settings.IRRIGATION_LOG
    def logger(m): log_with_timestamp(m, logfile)

    def run():
        try:
            update_status(True, validated_config.get('configId'))
            run_config(validated_config, logger)
            cleanup()
        except:
            cleanup()

    sched.add_job(run)

    return None


def validate_config(config, schema):
    validate(config, schema)
    return config


def run_config(config, logger):

    config_id = config.get('configId')
    name = config.get('name')
    gpio_pins = config.get('gpioPins')
    timeout = parse_duration(config.get('timeout'))
    zones = config.get('zones')

    logger(f"Starting Config: '{name}' - (id:{config_id}).")

    GPIO_Initialize(gpio_pins)

    for zone in zones:
        run_zone(zone, logger)
        time.sleep(timeout)


def run_zone(zone, logger):

    name = zone.get('name')
    sections = zone.get('sections')
    pump = zone.get('pump', None)

    logger(f"Zone '{name}' starting.")

    for section in sections:
        run_section(section, logger)

    run_pump(pump, logger)

    while len(sched.get_jobs()) > 0:
        time.sleep(1)


def run_section(section, logger):

    # Get Section Fields
    name = section.get('name')
    pin = section.get('pin')
    duration = parse_duration(section.get('duration'))

    # Calculate Off Time
    off_time = datetime.now() + timedelta(seconds=duration)

    # Turn on
    logger(f"Section '{name}' starting.")
    turn_on(pin)

    # Schedule Turn off
    sched.add_job(turn_off_with_log, DateTrigger(off_time), kwargs={
        'pin': pin,
        'm': f"Section '{name}' stopping.",
        'logger': logger
    })


def run_pump(pump, logger):
    if pump is not None:
        # Get Pump Fields
        name = pump.get('name')
        pin = pump.get('pin')
        init_time = parse_duration(pump.get('initTime'))

        time.sleep(init_time)

        jobs = sched.get_jobs()
        jobs_run_time = map(lambda j: j.next_run_time, jobs)

        if len(jobs) > 0:

            last_section_off_date = max(jobs_run_time)

            off_time = last_section_off_date - timedelta(seconds=init_time)

            if off_time > convert_to_datetime(datetime.now() + timedelta(seconds=1), get_localzone(), 'Now'):

                logger(f"Pump '{name}' starting.")
                turn_on(pin)

                sched.add_job(turn_off_with_log, DateTrigger(off_time), kwargs={
                    'pin': pin,
                    'm': f"Pump '{name}' stopping.",
                    'logger': logger
                })
            else:
                logger(
                    "Skipping Pump: too little time left, initTime too high or sections duration too low")
        else:
            logger(
                "Skipping Pump: all sections finished, initTime too high or sections duration too low")
