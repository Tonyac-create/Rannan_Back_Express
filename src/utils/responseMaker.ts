import { ResponseInterface } from "../interface/ResponseInterface";

export class ResponseMaker {

    async responseSuccess(message :string, data :any): Promise<ResponseInterface>{

        return { message, data, date : new Date()}
    }
}