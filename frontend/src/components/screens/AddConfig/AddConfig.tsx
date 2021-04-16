import { FC, useState } from "react";
import { ConfigJsonError } from "../../api";
import { Button, DurationInput, ErrorList, Header, SettingRow, TextInput } from "../../common";
import { useConfig } from "../../piConfig";
import { createEmptyConfig, createEmptyZone, validateConfig } from "../../piConfig";
import ZoneInput from "./ZoneInput";


const AddConfig: FC = () => {

    const [config, setConfig] = useState(createEmptyConfig())
    const [err, setErr] = useState<ConfigJsonError>({})

    const { addConfig } = useConfig()

    return (
        <div className="container">
            <Header
                title='Add Config'
            />
            <div className="padding-2">
                <SettingRow title="Name" >
                    <TextInput
                        value={config.name}
                        placeholder="Config Name"
                        onChange={name => setConfig(c => ({ ...c, name }))}
                        errors={err.name}
                    />
                </SettingRow>
                <SettingRow title="GPIO Pins">
                    {config.gpioPins.join(' - ')}
                </SettingRow>
                <SettingRow
                    title="Timeout"
                >
                    <DurationInput value={config.timeout} onChange={timeout => setConfig(c => ({ ...c, timeout }))} />
                    <ErrorList errors={err.timeout} />
                </SettingRow>
                {config.zones.map((z, i) => (
                    <ZoneInput
                        key={i}
                        zone={z} onChange={z => {
                            setConfig(c => {
                                c.zones[i] = z
                                return {
                                    ...c,
                                    zones: [...c.zones]
                                }
                            })
                        }}
                        remove={() => setConfig(c => {
                            const zones = [...c.zones]
                            zones.splice(i, 1)
                            return { ...c, zones }
                        })}
                        err={err.zones && err.zones[i]}
                    />
                ))}
                <ErrorList errors={err.non_field_errors} />
                <Button onClick={() => setConfig(c => ({ ...c, zones: [...c.zones, createEmptyZone()] }))}>
                    Add Zone
                </Button>
            </div>
            <div className="padding float-r">
                <Button
                    onClick={() => {
                        if (window.confirm("Are you sure?")) {
                            setConfig(createEmptyConfig())
                            setErr({})
                        }
                    }}
                >
                    clear
                    </Button>
                <Button onClick={() => setErr(validateConfig(config).err)}>
                    Verify
                </Button>
                <Button
                    type='primary'
                    onClick={() => {
                        const err = validateConfig(config)
                        err.isValid ?
                            addConfig({
                                config_json: JSON.stringify(config),
                                id: config.configId
                            }).then(() => {
                                setErr({})
                                setConfig(createEmptyConfig())
                                alert('Config Added Successfully')
                            }) :
                            setErr(err.err)
                    }}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}


export default AddConfig

