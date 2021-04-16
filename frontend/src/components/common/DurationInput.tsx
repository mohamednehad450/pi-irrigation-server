import { Duration, duration } from "moment";
import { FC, useState } from "react";
import { NumberInput } from ".";


interface DurationInputProps {
    value: Duration
    onChange: (d: Duration) => void
}


const DurationInput: FC<DurationInputProps> = ({ value, onChange }) => {

    const [seconds, setSeconds] = useState(value.as('seconds') % 60)
    const [minutes, setMinutes] = useState(Math.floor(value.as('seconds') / 60))

    const updateValue = (min: number, sec: number) => {
        onChange(duration({ minutes: min, seconds: sec }))
    }

    return (
        <>
            <NumberInput
                onChange={(n) => {
                    if (n > 0) {
                        setMinutes(n)
                        updateValue(n, seconds)
                    }
                    else {
                        setMinutes(0)
                        updateValue(0, seconds)
                    }
                }}
                value={minutes}
                label="Minutes"
            />
            <NumberInput
                onChange={n => {
                    if (n > 0) {
                        setSeconds(n)
                        updateValue(minutes, n)
                    }
                    else {
                        setSeconds(0)
                        updateValue(minutes, 0)
                    }
                }}
                value={seconds}
                label="Seconds"
            />
        </>
    )
}

export default DurationInput