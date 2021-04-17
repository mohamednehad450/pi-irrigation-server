# Mock GPIO class to test with.
class GPIO:
    BOARD = "BOARD"
    OUT = "OUT"
    LOW = "LOW"
    HIGH = "HIGH"

    def setmode(mode):
        print(f'MOCK: Setting board mode to {mode}')

    def setup(pin, mode, initial=0):
        print(
            f'MOCK: Setting Pin Number: {pin} as {mode}, Initial is: {initial}')

    def output(pin, state):
        print(f'MOCK: Setting Pin {pin} to {state}')

    def cleanup():
        print(f'MOCK: Cleaning up')
