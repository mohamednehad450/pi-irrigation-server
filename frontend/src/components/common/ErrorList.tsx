import { FC } from "react";

interface ErrorListProps {
    errors?: string[]
}

const ErrorList: FC<ErrorListProps> = ({ errors }) => {

    return (
        errors?.length ? (
            <ul className="textinput-errors">
                {errors.map(s => (<li key={s} className="textinput-error">{s}</li>))}
            </ul>
        ) : null
    )
}


export default ErrorList