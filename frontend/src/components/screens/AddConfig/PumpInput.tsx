import { duration } from "moment";
import { FC } from "react";
import { Pump, PumpError } from "../../api";
import { DurationInput, ErrorList, SettingRow, TextInput } from "../../common";
import PinSelect from "./PinSelect";


interface PumpInputProps {
    pump: Pump,
    onChange: (p: Pump) => void
    err?: PumpError
}



const PumpInput: FC<PumpInputProps> = ({ pump, onChange, err }) => {


    return (
        <div className="indent">
            <SettingRow title="Pump Name">
                <TextInput
                    onChange={name => onChange({ ...pump, name })}
                    value={pump.name}
                    placeholder="Name"
                    errors={err?.name}
                />
            </SettingRow>
            <SettingRow title="Pump Timeout">
                <DurationInput
                    value={duration(pump.initTime)}
                    onChange={initTime => onChange({ ...pump, initTime })}
                />
                <ErrorList errors={err?.initTime} />
            </SettingRow>
            <SettingRow title="Pump Pin">
                <PinSelect pin={pump.pin} onChange={pin => onChange({ ...pump, pin })} />
                <ErrorList errors={err?.pin} />
            </SettingRow>
            <ErrorList errors={err?.non_field_errors} />
        </div>
    )
}

export default PumpInput