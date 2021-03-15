import Axios from 'axios';

// Types
export interface User {
    token: string
    username: string
}
export interface UserError {
    username?: string[]
    password?: string[]
    non_field_errors?: string[]
}
export type GetToken = (
    username: string,
    password: string,
) => Promise<User>

export type RefreshToken = (
    oldToken: string,
) => Promise<string>


export const getToken: GetToken = async (username, password) => {
    const { data: { token } }
        = await Axios.post<{ token: string }>('/auth/get_token', {
            username,
            password
        })

    return { token, username }
}

export const refreshToken: RefreshToken = async (oldToken: string) => {
    const { data: { token } }
        = await Axios.post<{ token: string }>('/auth/refresh_token', {
            token: oldToken,
        }, {
            headers: {
                "Authorization": `JWT ${oldToken}`,
                "Content-Type": "application/json"
            }
        })
    return token
}
