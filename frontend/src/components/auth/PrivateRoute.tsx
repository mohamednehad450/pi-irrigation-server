import { FC } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '.'
import { routes } from '../../routes'

import type { RouteProps } from 'react-router-dom'

const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: routes.SIGININ,
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute
