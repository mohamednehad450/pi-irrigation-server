import time
from re import findall

try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print("couldn't import RPi.GPIO module, try again with sudo")
except ModuleNotFoundError:
    print(f'MOCK: couldn\'t find RPi.GPIO module, Using mock module instead.')
    from .mockGPIO import GPIO


def log_with_timestamp(message, f, mode="a"):

    m = f"[{time.ctime()}]: {message} \n"

    log = open(f, mode)
    log.write(m)
    log.close()

    return m


def GPIO_Initialize(gpio, mode=GPIO.BOARD):

    GPIO.setmode(mode)

    for pin in gpio:
        GPIO.setup(pin, GPIO.OUT, initial=1)


def turn_on(pin):
    GPIO.output(pin, GPIO.LOW)


def turn_off(pin):
    GPIO.output(pin, GPIO.HIGH)


def exit_handler():
    GPIO.cleanup()


def turn_off_with_log(pin, logger, m):
    turn_off(pin)
    logger(m)


def iso8601_duration_as_seconds(d):
    if d[0] != 'P':
        raise ValueError('Not an ISO 8601 Duration string')
    seconds = 0
    # split by the 'T'
    for i, item in enumerate(d.split('T')):
        for number, unit in findall('(?P<number>\d+)(?P<period>S|M|H|D|W|Y)', item):
            # print '%s -> %s %s' % (d, number, unit )
            number = int(number)
            this = 0
            if unit == 'Y':
                this = number * 31557600  # 365.25
            elif unit == 'W':
                this = number * 604800
            elif unit == 'D':
                this = number * 86400
            elif unit == 'H':
                this = number * 3600
            elif unit == 'M':
                # ambiguity ellivated with index i
                if i == 0:
                    this = number * 2678400  # assume 30 days
                    # print "MONTH!"
                else:
                    this = number * 60
            elif unit == 'S':
                this = number
            seconds = seconds + this
    return seconds
