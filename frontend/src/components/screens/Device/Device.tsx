import { FC } from "react";
import { Button, Header, SettingRow } from "../../common";
import { useConfig } from "../../piConfig";
import SchedInput from "./SchedInput";



const Device: FC = () => {
    const { sched, updateSched, status, configs, updateStatus } = useConfig()
    return (
        <div className="container">
            <Header
                title={'Device Management'}
            />
            <div className="padding">
                <span className="text-title">Device Status</span>
                <SettingRow title={"Status:"}>
                    <span className="text">{status?.running ? "Running" : "Idle"}</span>
                </SettingRow>
                <SettingRow title="Running Config:">
                    <span className="text">
                        {configs.find(({ id }) => id === status?.configId)?.config_json.name || status?.configId || "NULL"}
                    </span>
                </SettingRow>
                <Button onClick={() => updateStatus()}>
                    Refresh Status
                </Button>
            </div>
            <div className="padding">
                <span className="text-title">
                    Schedule
                </span>
                <SchedInput sched={sched} onChange={s => updateSched(s)} />
                <div className="padding-">
                </div>
            </div>
        </div>
    )
}

export default Device