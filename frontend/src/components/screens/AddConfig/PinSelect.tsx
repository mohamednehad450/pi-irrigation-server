import { FC } from "react";
import { ValidPin, validPinsArr } from "../../api";


interface PinSelectProps {
    pin: ValidPin,
    pins?: ValidPin[]
    onChange: (p: ValidPin) => void
}

const PinSelect: FC<PinSelectProps> = ({ pin, pins, onChange }) => {
    return (
        <select value={pin} onChange={e => onChange(validPinsArr[e.target.selectedIndex])}>
            {(pins || validPinsArr).map(p => <option key={p}>{p}</option>)}
        </select>
    )
}


export default PinSelect