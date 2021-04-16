import { FC } from "react";

interface NumberInputProps {
    label: string
    value: number
    onChange: (val: number) => void
}


const NumberInput: FC<NumberInputProps> = ({ value, label, onChange }) => {
    return (
        <span className="num-input-container">
            <span className="num-input-subtitle">
                {label}
            </span>
            <input
                className="input num-input"
                type="number"
                value={String(value)}
                onChange={(e) => {
                    if (e.target.value) {
                        onChange(Math.floor(parseInt(e.target.value)))
                    }
                    else onChange(0)
                }}
            ></input>
        </span>
    )
}

export default NumberInput