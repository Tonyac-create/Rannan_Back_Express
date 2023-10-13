import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Data } from "../entity/Data"
import { User } from "../entity/User"
import { DataService } from "../service/DataService"
import { ResponseInterface } from "../interface/ResponseInterface"
import { ResponseMaker } from "../utils/ResponseMaker"

export class DataController {

    // Services
    private dataService = new DataService()
    private responseMaker = new ResponseMaker()

    // Récupération de toute les datas d'un user_id
    async getDatasInUser(request: Request, response: Response, next: NextFunction)
        : Promise<ResponseInterface> {
        try {

            const id = +request.params.user_id

            const datas = await this.dataService.getDatasInUser(id)
            if (!datas) {
                throw new Error("No datas")
            }

            return this.responseMaker.responseSuccess("datas found", datas)
        }
        catch (error) {
            response.status(400).json({ error: error.message })
        }
    }

    // Récupération d'une data par son id
    async getOne(request: Request, response: Response, next: NextFunction) {
        // Récupération via l'id de la data
        try {
            const id = +request.params.id
            const data = await this.dataService.getOneById(id)
            if (!data) { return "data not fund" }
            return this.responseMaker.responseSuccess("data found", data)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

    // Création d'une data par userid
    async save(request: Request, response: Response, next: NextFunction) {
        const { id, type, name, value, user_id } = request.body
        try {
            const id = +request.params.id

            const data = await this.dataService.createDataOneUser(id, type, name, value, user_id)
            return this.responseMaker.responseSuccess("data created", data)
        }
        catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

    // Modification d'une data avec son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            const data = await this.dataService.getOneById(id)
            if (!data) { return "data not found" }
            return this.dataService.update(data.id, request.body)
        }
        catch (error) {
            response.status(500).json({ error: error.message })
        }

    };

    // Suppression d'une data
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            let dataToRemove = await this.dataService.getOneById(id)

            if (!dataToRemove) return "this data not exist"

            await this.dataService.remove(id)
            return "data has been removed"
        }
        catch (error) {
            response.status(500).json({ error: error.message })
        }
    }


}

