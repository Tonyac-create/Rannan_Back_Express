import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Data } from "../entity/Data"
import { User } from "../entity/User"
import { DataService } from "../service/DataService"
import { ResponseInterface } from "../interface/ResponseInterface"
import { ResponseMaker } from "../utils/ResponseMaker"
import { ShareService } from "../service/ShareService"
import { UserService } from "../service/UserService"
import { GroupService } from "../service/GroupService"
import { Share } from "../entity/Share"

export class DataController {

    // Services
    private dataService = new DataService()
    private userService = new UserService()
    private groupService = new GroupService()
    private responseMaker = new ResponseMaker()
    private shareService = new ShareService()


//!!!!! A VOIR PR SUPPRIMER
    // Récupération de toute les datas 
    // async all(request: Request, response: Response, next: NextFunction)
    //     : Promise<ResponseInterface>
    //      {
    //     try {
    //         const id = +request.params.user_id
    //         const datas = await this.dataService.all()
    //         if (!datas) 
    //         {
    //             throw new Error("No datas")
    //         }
    //         return this.responseMaker.responseSuccess("datas found", datas)
    //     }
    //     catch (error) {
    //         response.status(400).json({ error: error.message })
    //     }
    // }
//!!!!! A VOIR PR SUPPRIMER


    //Supprimer une share
    async removeShare(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            let authToRemove = await this.shareService.getShareById(id)

            if (!authToRemove) {
                throw new Error ("this authorization not exist")
            }

            await this.shareService.remove(id)
            return "share has been removed"
        }
        catch (error) {
            console.log("🚀 ~ file: AuthController.ts:103 ~ AuthController ~ remove ~ error:", error)
        }
    }

    // Création d'une share
    async createShare(request: Request, response: Response, next: NextFunction) {
        try {
            const data_id = request.body.data_id
            const target = request.body.target
            const target_id = +request.body.target_id
            const owner_id = +request.body.owner_id
           
            // Récupération de la data
            const data = await this.dataService.getOneById(data_id)

            // Si data n'existe pas
            if (!data) {
                throw new Error("data not fund")
            } else { // si data existe
                // target = group
                if (target === "group") {
                    const targetGroup = await this.groupService.oneGroup(target_id);
                    if (!targetGroup) {
                        throw new Error("Group don't exist")
                    } else {
                        const share = await this.shareService.create(target, target_id, owner_id)
                        
                        return this.responseMaker.responseSuccess("share ok", share)
                    }

                } else if (target === "user") {
                    const targetUser = await this.userService.findOne("id", target_id, false);
                    if (!targetUser) {
                        throw new Error("User don't exist")
                    } else {
                        const share = await this.shareService.create(target, target_id, owner_id)
                        
                        return this.responseMaker.responseSuccess("share ok", share)
                    }
                }
            }

        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    }

    // Récupére la liste des datas que le user concerné partage avec le user Token
    async getShare(request: Request, response: Response, next: NextFunction) {
        const token = request.header('Authorization').split(' ')[1]

    }

    // Récupération de toute les datas d'un user_id
    async getDatasInUser(request: Request, response: Response, next: NextFunction)
        : Promise<ResponseInterface> {
        try {

            // const id = +request.params.user_id
            const token = request.header('Authorization').split(' ')[1]

            const datas = await this.dataService.getDatasInUser(token)
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

            // Récupération du token
            const token = request.header('Authorization').split(' ')[1]
            if (!token) {
                throw new Error("token inexistant")
            }


            const data = await this.dataService.createDataOneUser(id, type, name, value, user_id, token)
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
            if (!data) {
                throw new Error("data not found")
            }
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

            if (!dataToRemove) {
                throw new Error("data not exist")
            }

            await this.dataService.remove(id)
            return "data has been removed"
        }
        catch (error) {
            response.status(500).json({ error: error.message })
        }
    }


}

