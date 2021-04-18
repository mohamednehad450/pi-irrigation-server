import { FC, MouseEventHandler } from 'react'

interface ButtonProps {
    type?: 'primary' | 'secondary'
    className?: string
    onClick?: MouseEventHandler
    disabled?: boolean
}


const Button: FC<ButtonProps> = ({
    type,
    onClick,
    children,
    className = '',
    disabled = false
}) => {
    return (
        <button
            className={`btn ${type === "primary" ? 'btn-prime' : 'btn-second'} ${disabled ? 'btn-disabled' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button