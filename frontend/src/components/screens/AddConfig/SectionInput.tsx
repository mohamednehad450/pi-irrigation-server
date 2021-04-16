import { FC } from "react"
import { duration } from "moment"
import { Section, SectionError } from "../../api"
import { Button, DurationInput, ErrorList, SettingRow, TextInput } from "../../common"
import PinSelect from "./PinSelect"

import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete.svg'


interface SectionInputProps {
    section: Section
    onChange: (s: Section) => void
    remove: () => void
    err?: SectionError
}

const SectionInput: FC<SectionInputProps> = ({ section, onChange, remove, err }) => {

    return (
        <div className="section-input-container">
            <Button className="btn-icon float-r padding" onClick={() => window.confirm('Delete Section?') && remove()}>
                <span className="icon">
                    <DeleteIcon />
                </span>
            </Button>
            <SettingRow title="Section Name">
                <TextInput
                    value={section.name}
                    onChange={name => onChange({ ...section, name })}
                    placeholder="name"
                    errors={err?.name}
                />
            </SettingRow>
            <SettingRow title="Duration">
                <DurationInput value={duration(section.duration)} onChange={duration => onChange({ ...section, duration })} />
                <ErrorList errors={err?.duration} />
            </SettingRow>
            <SettingRow title="Pin">
                <PinSelect pin={section.pin} onChange={pin => onChange({ ...section, pin })} />
                <ErrorList errors={err?.pin} />
            </SettingRow>
        </div>
    )
}


export default SectionInput