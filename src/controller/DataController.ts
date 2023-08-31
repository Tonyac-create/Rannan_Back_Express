import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Data } from "../entity/Data"
import { DataService } from "../service/DataService"

export class DataController {

    private dataRepository = AppDataSource.getRepository(Data)
    private dataService = new DataService()

    async all(request: Request, response: Response, next: NextFunction) {
        return this.dataRepository.find()
    }

    async getOne(request: Request, response: Response, next: NextFunction) {
        const id = +request.params.id

        const data = await this.dataRepository.findOne(
            {
                where: { id }
            }
        )

        if (!data) { return "data not fund"}

        return data
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            
            const {format, name, value} = request.body


            const data = await this.dataService.create({ format, name, value })
            return data
        }
        catch (error) {
            console.log(error);
              
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id

            let dataToRemove = await this.dataRepository.findOneBy({ id })
    
            if (!dataToRemove) return "this data not exist"
    
            await this.dataRepository.remove(dataToRemove)
    
            return "data has been removed"
        }
        catch (error) {
            console.log(error);
            
        }
        
    }

    // async update(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         const id = +request.params.id

    //         const updateData = await this.dataService.update(id)

    //         return updateData;

    //     } catch (error) {
    //         console.log("error", error)
    //     }
    // }

    async update(request: Request, response: Response, next: NextFunction) {
        
        const id = +request.params.id

        const updateData = await this.dataRepository.findOne({ where: { id } })

        this.dataRepository.merge(updateData, request.body);
        await this.dataRepository.save(updateData);
        return updateData
      };


}