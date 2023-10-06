import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Data } from "../entity/Data"
import { User } from "../entity/User"
import { DataService } from "../service/DataService"

export class DataController {

    // Services
    private dataService = new DataService()

    // Récupération de toutes les datas crées
    async all(request: Request, response: Response, next: NextFunction) {
        return this.dataService.all()
    }

    // Récupération de toute les datas d'un user_id
    async getDatasInUser(request: Request, response: Response, next: NextFunction) {
        try {
            const datas = await this.dataService.getDatasInUser(+request.params.user_id)
            return datas
        }
        catch (error) {
            console.log(error);
        }
    }

    // Récupération d'une data par son id
    async getOne(request: Request, response: Response, next: NextFunction) {
        // Récupération via l'id de la data
        const id = +request.params.id
        const data = await this.dataService.getOneById(id)
        if (!data) { return "data not fund" }
        return data
    }

    // Création d'une data par userid
    async save(request: Request, response: Response, next: NextFunction) {
        const { id, type, name, value, user_id } = request.body
        try {
            const id = +request.params.id

            const data = await this.dataService.createDataOneUser(id, type, name, value, user_id)
            return data
        }
        catch (error) {
            console.log(error);
        }
    }

    // Modification d'une data avec son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            const data = await this.dataService.getOneById(id)
            if (!data) { return "data not found"}
            return this.dataService.update(data.id, request.body)
        }
        catch (error) {
            console.log("🚀 ~ file: DataController.ts:60 ~ DataController ~ update ~ error:", error)
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
            console.log(error);
        }
    }


}




            // // const {format, name, value} = request.body
            // const userId = +request.params.id
            // console.log("id du user récupérer dans controller", userId);
            // const data = await this.dataService.addDataOneUser(request.body, userId)
            // console.log("nouvelle data controller", data);
            // return data