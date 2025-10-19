import {Response} from "express"

export interface APIError {
    status: number,
    message: string
}

export const sendAPIError = (res: Response, error: APIError) => {
    return res.status(error.status).json({error: error.message})
}
export const sendData = (res: Response, data: any, status: number = 200) => {
    return res.status(status).json(data)
}