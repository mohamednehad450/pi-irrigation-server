import Axios from "axios"
import { Duration } from "moment";
import { User } from "../auth"


export interface Sched {
    daysOfWeek: number[]
    hour: number
    minute: number
    configId: string | null
}

export interface Status {
    configId: string | null
    running: boolean
}

export interface PiConfig {
    id: string
    config_json: string
}

export interface ParsedPiConfig {
    id: string
    config_json: ConfigJson
}

export type ValidPin = (3 | 5 | 7 | 26 | 10 | 12 | 11 | 13 | 15 | 16 | 18 | 19 | 21 | 22 | 24 | 23);
export const validPinsArr: ValidPin[] = [3, 5, 7, 26, 10, 12, 11, 13, 15, 16, 18, 19, 21, 22, 24, 23]


export type Section = {
    name: string,
    pin: ValidPin,
    duration: Duration | string,
}

export type SectionError = {
    name?: string[],
    pin?: string[],
    duration?: string[],
    non_field_errors?: string[]
}

export type Pump = {
    name: string,
    pin: ValidPin,
    initTime: Duration | string,
}

export type PumpError = {
    name?: string[],
    pin?: string[],
    initTime?: string[],
    non_field_errors?: string[]
}

export type Zone = {
    name: string,
    sections: Section[]
    pump?: Pump
}

export type ZoneError = {
    name?: string[],
    sections?: SectionError[]
    pump?: PumpError
    non_field_errors?: string[]
}
export interface ConfigJson {
    configId: string
    name: string,
    gpioPins: ValidPin[]
    timeout: Duration | string
    zones: Zone[]
}

export interface ConfigJsonError {
    configId?: string[]
    name?: string[]
    gpioPins?: string[]
    timeout?: string[]
    zones?: ZoneError[]
    non_field_errors?: string[]
}


export interface PiConfigError {
    id?: string[]
    config_json?: string[]
    non_field_errors?: string[]
    notFound?: boolean
}

export const getPiConfigs = async (user?: User): Promise<PiConfig[]> => {
    const { data } =
        await Axios.get<PiConfig[]>('/api/configs/', {
            headers: {
                "Authorization": `JWT ${user?.token}`
            }
        })
    return data
}


export const addNewPiConfig = async (config: Partial<PiConfig>, user?: User): Promise<PiConfig> => {
    const { data } =
        await Axios.post<PiConfig>('/api/configs/', config, {
            headers: {
                "Authorization": `JWT ${user?.token}`
            }
        })
    return data
}

export const updatePiConfig = async (id: PiConfig['id'], config: Partial<PiConfig>, user?: User): Promise<PiConfig> => {
    const { data } =
        await Axios.put<PiConfig>(`/api/configs/${id}/`, config, {
            headers: {
                "Authorization": `JWT ${user?.token}`
            }
        })
    return data
}


export const removePiConfig = async (id: PiConfig['id'], user?: User): Promise<void> => {
    await Axios.delete<void>(`/api/configs/${id}/`, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
}


export const runConfig = async (id: PiConfig['id'], user?: User): Promise<void> => {
    await Axios.post<void>(`/api/configs/${id}/run_config/`, {}, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
}


export const getStatus = async (user?: User): Promise<Status> => {
    const { data } = await Axios.get<Status>(`/api/configs/get_device_status/`, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
    return data
}


export const getSched = async (user?: User): Promise<Sched> => {
    const { data } = await Axios.get<Sched>(`/api/configs/sched/`, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
    return data
}


export const updateSched = async (sched: Sched, user?: User): Promise<Sched> => {
    const { data } = await Axios.post<Sched>(`/api/configs/sched/`, { ...sched }, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
    return data
}


export const getLog = async (user?: User): Promise<string> => {
    const { data } = await Axios.get<{ "log": string }>(`/api/configs/get_log/`, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
    return data.log
}

