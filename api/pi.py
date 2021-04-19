import time
import json
import atexit
from jsonschema import validate

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger, convert_to_datetime, datetime, get_localzone

from datetime import timedelta, datetime, timezone

from .utils import iso8601_duration_as_seconds as parse_duration, turn_on, turn_off_with_log, GPIO_Initialize, log_with_timestamp, GPIO_cleanup

from .models import PiConfig
from django.conf import settings
from django.core.exceptions import ValidationError, ObjectDoesNotExist


def sched_handler():
    # Getting Time
    d = datetime.now()

    # Get device status
    s = get_sched()

    # Get sched fields
    days = s.get('daysOfWeek')
    hour = s.get('hour')
    minute = s.get('minute')
    config_id = s.get('configId')

    # Checking for the active config
    if config_id is not None:

        # checking if should run
        day = d.weekday()
        h = d.hour
        m = d.minute
        if day in days and h == hour and m == minute:

            # Getting config
            try:
                config = PiConfig.objects.get(id=config_id)

            # Id is invalid
            except ValidationError:
                log_with_timestamp(
                    f"INVALID CONFIG ID IN SCHEDULE: {config_id}", settings.IRRIGATION_LOG)
                return
            # Config doesn't exist
            except ObjectDoesNotExist:
                log_with_timestamp(
                    f"MISSING CONFIG IN SCHEDULE: {config_id}", settings.IRRIGATION_LOG)
                return

            r = start_config(config.config_json)

            # Fail to run: another config is running
            if r is not None:
                running_id = get_status().get('configId')
                log_with_timestamp(
                    f"Another config ({running_id}) is already running, Skipping scheduled: {config_id}", settings.IRRIGATION_LOG)


sched = BackgroundScheduler()
sched.start()

sched.add_job(sched_handler, 'interval', minutes=1)


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


def get_sched():
    s = json.load(open(settings.IRRIGATION_SCHED, 'r'))
    schema = json.load(open(settings.IRRIGATION_SCHED_SCHEMA, 'r'))
    return validate_sched(s, schema)


def update_sched(sched):
    schema = json.load(open(settings.IRRIGATION_SCHED_SCHEMA, 'r'))
    obj = validate_sched(sched, schema)
    f = open(settings.IRRIGATION_SCHED, 'w')
    json.dump(obj, f)
    f.close()
    return obj


def validate_sched(sched, schema):
    validate(sched, schema)
    return sched


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
