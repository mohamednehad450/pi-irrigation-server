import { FC } from "react";

interface SettingRowProps {
    title: string
}


const SettingRow: FC<SettingRowProps> = ({ title, children }) => {

    return (
        <div className="setting-row padding">
            <span className="setting-title">
                {title}
            </span>
            <span className="setting-input">
                {children}
            </span>
        </div>
    )
}

export default SettingRow