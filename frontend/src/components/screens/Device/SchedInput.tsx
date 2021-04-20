import { FC } from "react";
import { Sched } from "../../api";
import { SettingRow } from "../../common";
import { useConfig } from "../../piConfig";
import { HTMLMap } from '../../utils'

interface SchedInputProps {
    sched?: Sched
    onChange: (s: Sched) => void
}

const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

const SchedInput: FC<SchedInputProps> = ({ sched, onChange }) => {

    const { configs } = useConfig()

    return (
        <>
            <SettingRow title="Time">
                <select
                    value={sched?.hour}
                    onChange={e => sched && onChange({ ...sched, hour: e.target.selectedIndex })}
                >
                    {[...Array(24)].map((_, i) => (
                        <option value={i}>{i}</option>
                    ))}
                </select>
                <select
                    value={sched?.minute}
                    onChange={e => sched && onChange({ ...sched, minute: e.target.selectedIndex })}
                >
                    {[...Array(60)].map((_, i) => (
                        <option value={i}>{i}</option>
                    ))}
                </select>
            </SettingRow>
            <SettingRow title="Days of the week">
                <select
                    multiple
                    value={sched?.daysOfWeek.map(String) || []}
                    onChange={e => sched &&
                        onChange({
                            ...sched,
                            daysOfWeek: HTMLMap(e.target.selectedOptions, (item) => parseInt(item.value)),
                        })
                    }
                >
                    {days.map((label, i) => (
                        <option value={i} >{label}</option>
                    ))}
                </select>
            </SettingRow>
            <SettingRow title="Active Config" >
                <select
                    value={sched?.configId || ''}
                    onChange={e => sched && onChange({ ...sched, configId: configs[e.target.selectedIndex].id })}
                >
                    {configs.map(c => (
                        <option value={c.id}>{c.config_json.name}</option>
                    ))}
                </select>

            </SettingRow>
        </>
    )
}



export default SchedInput