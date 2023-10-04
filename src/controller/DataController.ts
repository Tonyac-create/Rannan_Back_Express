import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Data } from "../entity/Data"
import { User } from "../entity/User"
import { DataService } from "../service/DataService"

export class DataController {

// Services
    private dataRepository = AppDataSource.getRepository(Data) //! a remplacer par le dataService
    private dataService = new DataService()

//? Utile?
    async all(request: Request, response: Response, next: NextFunction) {
        return this.dataRepository.find() //! a remplacer par le dataService
    }

    async getDatasInUser(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = +request.params.id
            const datas = await this.dataService.getDatasInUser(userId)
            return datas
        }
        catch (error) {
            console.log(error);
        }
    }

    async getOne(request: Request, response: Response, next: NextFunction) {
        // Récupération via l'id de la data
        const id = +request.params.id
        const data = await this.dataRepository.findOne({where: { id }}) //! a remplacer par le dataService
        if (!data) { return "data not fund" }
        return data
    }


    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const data = await this.dataService.addDataOneUser(request.body)
            return data
            // // const {format, name, value} = request.body
            // const userId = +request.params.id
            // console.log("id du user récupérer dans controller", userId);
            // const data = await this.dataService.addDataOneUser(request.body, userId)
            // console.log("nouvelle data controller", data);
            // return data
        }
        catch (error) {
            console.log(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = +request.params.id
        const updateData = await this.dataRepository.findOne({ where: { id } })  //! a remplacer par le dataService
        this.dataRepository.merge(updateData, request.body);  //! a remplacer par le dataService
        await this.dataRepository.save(updateData);  //! a remplacer par le dataService
        return updateData
    };

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            let dataToRemove = await this.dataRepository.findOneBy({ id })  //! a remplacer par le dataService
            if (!dataToRemove) return "this data not exist"
            await this.dataRepository.remove(dataToRemove)  //! a remplacer par le dataService
            return "data has been removed"
        }
        catch (error) {
            console.log(error);
        }
    }


}
