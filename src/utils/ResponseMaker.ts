import { ResponseInterface } from "../interface/ResponseInterface";

export class ResponseMaker {

    async responseSuccess(message :string, data :any): Promise<ResponseInterface>{

        return { message: message, data: data, date : new Date()}
    }
}