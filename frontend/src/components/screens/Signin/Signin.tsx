import { FC, useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom';
import { routes } from '../../../routes';
import { useAuth } from '../../auth'
import { Button, ErrorList, TextInput } from '../../common';

import type { UserError } from '../../auth'


const SignIn: FC = () => {
    let auth = useAuth();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState<UserError | undefined>()

    const location: any = useLocation()
    if (auth.user) {
        return <Redirect to={location?.state?.from || routes.APP} />
    }
    return (
        <div className="container-sm">
            <form onSubmit={(e) => e.preventDefault()} className="login-form">
                <div className="col">
                    <TextInput
                        placeholder="Username"
                        onChange={(s) => {
                            setUsername(s);
                            error?.username && setError({ ...error, username: undefined })
                        }}
                        errors={error?.username}
                        value={username}
                        className="ver-margin stretch"
                    />
                    <TextInput
                        placeholder="Password"
                        onChange={(password) => {
                            setPassword(password);
                            error?.password && setError({ ...error, password: undefined })
                        }}
                        errors={error?.password}
                        value={password}
                        type='password'
                        className="ver-margin stretch"
                    />
                </div>
                <div className="col ver-margin">
                    <ErrorList errors={error?.non_field_errors} />
                    <Button
                        type="primary"
                        className="btn-row"
                        onClick={() => {
                            if (username && password) {
                                auth.signin(
                                    username,
                                    password,
                                ).catch(err => err && setError(err))
                            }
                            else {
                                const err: UserError = {}
                                if (!username) {
                                    err.username = ['This field can\'t be blank']
                                }
                                if (!password) {
                                    err.password = ['This field can\'t be blank']
                                }
                                setError(err)
                            }
                        }}
                    >
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SignIn