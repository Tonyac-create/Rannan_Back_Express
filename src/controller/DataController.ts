import { NextFunction, Request, Response } from "express"
import { ResponseInterface } from "../interface/ResponseInterface"
import { ResponseMaker } from "../utils/ResponseMaker"
import { RequestWithUser } from "../interface/RequestWithUser.interface"
import { publishMessage, requestMessage } from "../../nats-config"

export class DataController {

    // Services
    private responseMaker = new ResponseMaker()

    // Récupération de toute les datas d'un user_id
    async getDatasInUser(request: RequestWithUser, response: Response, next: NextFunction)
        : Promise<ResponseInterface> {
        try {

            const id = +request.user.user_id
            return await requestMessage('getAllDatasOneUser', id)
        }
        catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }
    }

    // Récupération d'une data par son id
    async getOne(request: Request, response: Response, next: NextFunction)
    : Promise<ResponseInterface> {
        // Récupération via l'id de la data
        try {

            const id = request.params.id
            return await requestMessage('getOneData', id)
        } catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }
    }

    // Création d'une data par userid
    async save(request: RequestWithUser, response: Response, next: NextFunction) {

        const { type, name, value } = request.body
        console.log("🚀 ~ file: DataController.ts:50 ~ DataController ~ save ~ request.body:", request.body)
        try {

            // Récupération du token
            const user_id = request.user.user_id
            if (!user_id) {
                throw new Error("user inexistant")
            }

            return await publishMessage('createData', { type, name, value, user_id })
        }
        catch (error) {
            return this.responseMaker.responseError(401, error.message)
        }
    }

    // Modification d'une data avec son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params.id
            console.log("🚀 ~ file: DataController.ts:70 ~ DataController ~ update ~ _id:", _id)
            const { type, name, value } = request.body

            return await publishMessage('updateData', { _id, type, name, value })
        }
        catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }

    };

    // Suppression d'une data
    async remove(request: Request, response: Response, next: NextFunction) {
        try {

            const id = request.params.id
            return await publishMessage('removeData', id)
        }
        catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }
    }

}

