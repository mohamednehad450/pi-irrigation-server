import Axios from "axios"
import { User } from "../auth"


export interface PiConfig {
    id: string
    config_json: string
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


