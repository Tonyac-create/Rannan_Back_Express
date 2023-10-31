import { ResponseInterface } from "../interface/ResponseInterface";

export class ResponseMaker {

    async responseSuccess(status: number, message: string, data?: any): Promise<ResponseInterface>{
        if (data) {
            return {status : status, message: message, data: data}
        }
        return {status : status, message: message}
    }

    async responseError(status: number, message :string): Promise<ResponseInterface>{
        return {status : status, message: message}
    }
}