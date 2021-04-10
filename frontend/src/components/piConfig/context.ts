import { createContext, useContext, useEffect, useState } from "react";
import { removeFromArray } from "../utils";

import { getPiConfigs, addNewPiConfig, removePiConfig } from '../api'

import type { AuthContext } from '../auth';
import { PiConfig } from "../api";



export interface PiConfigContext {
    configs: PiConfig[]
    addConfig: (c: Partial<PiConfig>) => Promise<void>
    deleteConfig: (id: PiConfig['id']) => Promise<void>
}

const defaultConfigContext: PiConfigContext = {
    configs: [],
    addConfig: async () => console.error('auth not initialized'),
    deleteConfig: async () => console.error('auth not initialized'),
};



export const configContext = createContext<PiConfigContext>(defaultConfigContext);

export const useConfig = () => {
    return useContext(configContext);
}


const isAuthError = (err: any): boolean => {
    const { response, isAxiosError } = err
    if (isAxiosError) {
        const { status } = response
        if (status === 401 || status === 403) {
            return true
        }
    }
    return false
}

const handleErr = (err: any): any => {
    const { response, isAxiosError } = err


    if (isAxiosError) {
        const { status, data } = response

        if (status === 404) {
            // eslint-disable-next-line no-throw-literal
            throw { notFound: true, ...data }
        }
        else if (status === 400) {
            throw data
        }
        else if (status === 500) {
            alert('Something went wrong, Please try again later or refresh the page.')
        }
    }
}

export const useProvideConfig = ({ user, signout }: AuthContext): PiConfigContext => {

    const [configs, setConfigs] = useState<PiConfig[]>([]);

    const addConfig: PiConfigContext['addConfig'] = (c) => addNewPiConfig(c, user)
        .then(c => setConfigs(cs => [c, ...cs]))
        .catch(err => isAuthError(err) ? signout() : handleErr(err));

    const deleteConfig: PiConfigContext['deleteConfig'] = id => removePiConfig(id, user)
        .then(() => setConfigs(removeFromArray(configs, id)))
        .catch(err => isAuthError(err) ? signout() : handleErr(err));


    useEffect(() => {
        user &&
            getPiConfigs(user)
                .then(setConfigs)
                .catch(err => isAuthError(err) ? signout() : handleErr(err));
    }, [user, signout])


    return {
        configs,
        addConfig,
        deleteConfig
    };
}
