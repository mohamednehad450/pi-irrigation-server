import { createContext, useContext, useEffect, useState } from "react";
import { removeFromArray, replaceFromArray } from "../utils";

import {
    getPiConfigs,
    addNewPiConfig,
    removePiConfig,
    updatePiConfig,
    runConfig as runConfigAPI,
    getSched as getSchedAPI,
    updateSched as updateSchedAPI,
    getStatus as getStatusAPI,
    getLog as getLogAPI,
} from '../api'

import type { AuthContext } from '../auth';
import type { PiConfig, ParsedPiConfig, Sched, Status } from "../api";



export interface PiConfigContext {
    configs: ParsedPiConfig[]
    addConfig: (c: Partial<PiConfig>) => Promise<void>
    updateConfig: (id: PiConfig['id'], c: Partial<PiConfig>) => Promise<void>
    deleteConfig: (id: PiConfig['id']) => Promise<void>
    runConfig: (id: PiConfig['id']) => Promise<void>
    updateStatus: () => Promise<void>
    status?: Status,
    updateSched: (sched: Sched) => Promise<void>,
    sched?: Sched,
    log: string
    getLog: () => Promise<void>
}

const defaultConfigContext: PiConfigContext = {
    configs: [],
    addConfig: async () => console.error('auth not initialized'),
    updateConfig: async () => console.error('auth not initialized'),
    deleteConfig: async () => console.error('auth not initialized'),
    runConfig: async () => console.error('auth not initialized'),
    updateSched: async () => console.error('auth not initialized'),
    updateStatus: async () => console.error('auth not initialized'),
    getLog: async () => console.error('auth not initialized'),
    log: '',
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

    const [configs, setConfigs] = useState<ParsedPiConfig[]>([]);
    const [sched, setSched] = useState<Sched>()
    const [status, setStatus] = useState<Status>()

    const [log, setLog] = useState('')

    const getLog: PiConfigContext['getLog'] = () => getLogAPI(user)
        .then(setLog)

    const addConfig: PiConfigContext['addConfig'] = (c) => addNewPiConfig(c, user)
        .then(c => setConfigs(cs => [{ id: c.id, config_json: JSON.parse(c.config_json) }, ...cs]))
        .catch(err => isAuthError(err) ? signout() : handleErr(err));

    const deleteConfig: PiConfigContext['deleteConfig'] = id => removePiConfig(id, user)
        .then(() => setConfigs(removeFromArray(configs, id)))
        .catch(err => isAuthError(err) ? signout() : handleErr(err));

    const runConfig: PiConfigContext['runConfig'] = id => runConfigAPI(id, user)
        .catch(err => isAuthError(err) ? signout() : handleErr(err));

    const updateConfig: PiConfigContext['updateConfig'] = (id, c) => updatePiConfig(id, c, user)
        .then(c => setConfigs(cs => replaceFromArray(cs, { ...c, config_json: JSON.parse(c.config_json) })))
        .catch(err => isAuthError(err) ? signout() : handleErr(err));

    const updateSched: PiConfigContext['updateSched'] = (sched: Sched) => updateSchedAPI(sched, user)
        .then(setSched)

    const updateStatus: PiConfigContext['updateStatus'] = () => getStatusAPI(user)
        .then(setStatus)

    useEffect(() => {
        user &&
            getPiConfigs(user)
                .then(cs => setConfigs(cs.map(c => ({ ...c, config_json: JSON.parse(c.config_json) }))))
                .catch(err => isAuthError(err) ? signout() : handleErr(err));
        user &&
            getStatusAPI(user).then(setStatus)
        user &&
            getSchedAPI(user).then(setSched)
    }, [user, signout])


    return {
        configs,
        addConfig,
        deleteConfig,
        updateConfig,
        runConfig,
        sched,
        status,
        updateSched,
        updateStatus,
        getLog,
        log
    };
}
