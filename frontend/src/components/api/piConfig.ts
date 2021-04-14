import Axios from "axios"
import { User } from "../auth"


export interface PiConfig {
    id: string
    config_json: string
}

export type ValidPin = (3 | 5 | 7 | 26 | 10 | 12 | 11 | 13 | 15 | 16 | 18 | 19 | 21 | 22 | 24 | 23);
export const validPinsArr: ValidPin[] = [3, 5, 7, 26, 10, 12, 11, 13, 15, 16, 18, 19, 21, 22, 24, 23]


export type Section = {
    name: string,
    pin: ValidPin,
    duration: string,
}

export type Pump = {
    name: string,
    pin: ValidPin,
    initTime: string,
}

export type Zone = {
    title: string,
    section: Section[]
    pump?: Pump
}

export interface ConfigJson {
    configId: string
    name: string,
    gpioPins: ValidPin[]
    timeout: string
    zones: Zone[]
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

export const removePiConfig = async (id: PiConfig['id'], user?: User): Promise<void> => {
    await Axios.delete<void>(`/api/configs/${id}/`, {
        headers: {
            "Authorization": `JWT ${user?.token}`
        }
    })
}


