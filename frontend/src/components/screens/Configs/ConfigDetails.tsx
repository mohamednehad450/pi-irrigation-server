import { duration } from "moment";
import { FC } from "react";
import { ConfigJson } from "../../api";
import { SettingRow } from "../../common";
import { formatDuration } from "../../utils";

interface ConfigDetailsProps {
    config: ConfigJson
}


const ConfigDetails: FC<ConfigDetailsProps> = ({ config }) => {



    return (
        <>
            <SettingRow title="Name:">
                <span className="text">
                    {config.name}
                </span>
            </SettingRow>
            <SettingRow title="GPIO Pins:">
                <span className="text">
                    {config.gpioPins.join(' - ')}
                </span>
            </SettingRow>
            <SettingRow title="Timeout:">
                <span className="text">
                    {formatDuration(duration(config.timeout))}
                </span>
            </SettingRow>
            <span className="text-title">Zones</span>
            <div className="padding-h">
                {config.zones.map(z => (
                    <div className="border margin-v">
                        <SettingRow title="Name:">
                            <span className="text">
                                {z.name}
                            </span>
                        </SettingRow>
                        {z.pump ? (
                            <>
                                <SettingRow title="Pump Name:">
                                    <span className="text">
                                        {z.pump.name}
                                    </span>
                                </SettingRow>
                                <SettingRow title="Pump Pin:">
                                    <span className="text">
                                        {z.pump.pin}
                                    </span>
                                </SettingRow>
                                <SettingRow title="Pump Timeout:">
                                    <span className="text">
                                        {formatDuration(duration(z.pump.initTime))}
                                    </span>
                                </SettingRow>
                            </>
                        ) : null}
                        <span className="text-title">Sections</span>
                        <div className="padding-h" >
                            {z.sections.map(s => (
                                <div className="border margin-v">
                                    <SettingRow title="Name:">
                                        <span className="text">
                                            {s.name}
                                        </span>
                                    </SettingRow>
                                    <SettingRow title="Pin:">
                                        <span className="text">
                                            {s.pin}
                                        </span>
                                    </SettingRow>
                                    <SettingRow title="Duration:">
                                        <span className="text">
                                            {formatDuration(duration(s.duration))}
                                        </span>
                                    </SettingRow>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}


export default ConfigDetails