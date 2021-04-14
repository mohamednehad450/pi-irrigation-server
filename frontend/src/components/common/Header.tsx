import { FC, ReactNode } from 'react'


interface HeaderProps {
    title: string
    subtitle?: string
    actions?: ReactNode
}

const Header: FC<HeaderProps> = ({ title, subtitle, actions }) => {

    return (
        <div className="header">
            <div className="header-titles">
                <span className="header-title">{title}</span>
                {subtitle && <span className="header-subtitle">{subtitle}</span>}
            </div>
            <div className="header-actions">
                {actions}
            </div>
        </div>
    )
}

export default Header