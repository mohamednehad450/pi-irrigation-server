import { FC } from "react";
import { Zone, ZoneError } from "../../api";
import { Button, ErrorList, SettingRow, TextInput } from "../../common";
import { createEmptyPump, createEmptySection } from "../../piConfig";
import PumpInput from "./PumpInput";
import SectionInput from "./SectionInput";

import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete.svg'

interface ZoneInputProps {
    zone: Zone
    onChange: (z: Zone) => void
    err?: ZoneError
    remove: () => void
}


const ZoneInput: FC<ZoneInputProps> = ({ zone, onChange, remove, err }) => {


    return (
        <div className="zone-input-container indent" >
            <Button className="btn-icon float-r padding" onClick={() => window.confirm('Delete Zone?') && remove()}>
                <span className="icon">
                    <DeleteIcon />
                </span>
            </Button>
            <SettingRow title="Name">
                <TextInput
                    placeholder="Zone Name"
                    value={zone.name}
                    onChange={name => onChange({ ...zone, name })}
                    errors={err?.name}
                />
            </SettingRow>
            <SettingRow title="Need Pump?">
                <input
                    type="checkbox"
                    checked={!!zone.pump}
                    onChange={e => e.target.checked ? onChange({ ...zone, pump: createEmptyPump() }) : onChange({ ...zone, pump: undefined })}
                ></input>
            </SettingRow>
            {zone.pump ? <PumpInput err={err?.pump} pump={zone.pump} onChange={pump => onChange({ ...zone, pump })} /> : null}
            {zone.sections.map((s, i) => (
                <SectionInput
                    err={err?.sections?.[i]}
                    section={s}
                    onChange={s => {
                        const sections = [...zone.sections]
                        sections[i] = s
                        onChange({ ...zone, sections })
                    }}
                    remove={() => {
                        const sections = [...zone.sections]
                        sections.splice(i, 1)
                        onChange({ ...zone, sections })
                    }}
                />
            ))}
            <ErrorList errors={err?.non_field_errors} />
            <Button onClick={() => onChange({ ...zone, sections: [...zone.sections, createEmptySection()] })}>
                Add Section
            </Button>
        </div>
    )
}

export default ZoneInput