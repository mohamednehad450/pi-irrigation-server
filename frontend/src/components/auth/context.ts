import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getItemFromStorage, removeItemFromStorage, setItemToStorage } from "../utils";
import { getToken, refreshToken } from ".";

import type { User } from ".";

type SignIn = (username: string, password: string) => Promise<void>
type SignOut = () => void

export interface AuthContext {
    signin: SignIn
    signout: SignOut
    user?: User
}

const defaultAuthContext: AuthContext = {
    signin: async () => console.error('auth not initialized'),
    signout: async () => console.error('auth not initialized'),
};



export const authContext = createContext<AuthContext>(defaultAuthContext);

export const useAuth = () => {
    return useContext(authContext);
}


export const AUTH_REFRESH_INTERVAL = 3 * 60 * 1000

export const useProvideAuth = (): AuthContext => {

    const [user, setUser] = useState<User | undefined>();
    const [lastRefreshed, setLastRefreshed] = useState(0)

    useEffect(() => {
        const user: User = getItemFromStorage('user')
        user && refreshToken(user.token).then(token => {
            setLastRefreshed(Date.now())
            updateUser({ ...user, token })
        })
    }, [])

    const updateToken = useCallback(() => {
        if (Date.now() > lastRefreshed + AUTH_REFRESH_INTERVAL) {
            setLastRefreshed(Date.now())
            if (user) {
                refreshToken(user.token)
                    .then(token => updateUser({ ...user, token }))
                    .catch(() => updateUser(undefined))
            }
        }
    }, [lastRefreshed, user])

    // Refreshing Token
    useEffect(() => {
        if (user) {
            const interval = setInterval(updateToken, 3 * 1000)
            return () => clearInterval(interval)
        }
    }, [updateToken, user])

    const updateUser = (user: User | undefined) => {
        if (user) {
            setUser(user)
            setItemToStorage('user', user)
        }
        else {
            setUser(undefined)
            removeItemFromStorage('user')
        }
    }



    const signin: SignIn = (username, password) => {
        return getToken(username, password)
            .then(updateUser)
            .catch(error => {
                const { response, isAxiosError } = error
                if (isAxiosError) {
                    const { data, status } = response
                    if (status === 400) {
                        throw data
                    }
                }
            })
    };
    const signout: SignOut = () => {
        updateUser(undefined)
    };

    return {
        user,
        signin,
        signout,
    };
}
