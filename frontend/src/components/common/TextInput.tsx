import { FC } from 'react'
import { ErrorList } from '.'

interface TextInputProps {
    placeholder?: string
    className?: string
    value?: string
    autofocus?: boolean
    type?: string
    autoComplete?: string
    onChange: (value: string) => void
    errors?: string[]
}

const TextInput: FC<TextInputProps> = ({
    placeholder,
    onChange,
    value = '',
    className = "",
    type = "",
    autofocus = false,
    autoComplete = "",
    errors = []
}) => {
    return (
        <span className={`textinput-container ${className}`}>
            <input
                className={`input ${!errors.length ? '' : 'input-invalid'}`}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                value={value}
                autoFocus={autofocus}
                type={type || 'text'}
                autoComplete={autoComplete}
            >
            </input>
            <ErrorList errors={errors} />
        </span>
    )
}

export default TextInput