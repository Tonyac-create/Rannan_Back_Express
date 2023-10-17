import { NextFunction, Request, Response } from "express";
import { ShareService } from "../service/ShareService";
import { DataService } from "../service/DataService";
import { GroupService } from "../service/GroupService";
import { UserService } from "../service/UserService";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { Share } from "../entity/Share";
const jwt = require('jsonwebtoken');

export class ShareController {

    // Services
    private shareService = new ShareService()
    private dataService = new DataService()
    private groupService = new GroupService()
    private userService = new UserService()

    // Récupération de tout les partages pour test
    async allShares(request: Request, response: Response, next: NextFunction) {
        try {
            const shares = await this.shareService.allShares()
            console.log("🚀 ~ file: ShareController.ts:19 ~ ShareController ~ allshares ~ shares:", shares)
        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    }

    // Récupération de la liste des users avec qui il y a un ou des partages
    async getListUsers(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            const user = request.user
            let list = []
            let userList = []
            if (!request.body.target) {
                throw new Error("target undefined")
            }

            const getAllSharesList = await this.shareService.allShares()

            if (request.body.target === "user") {

                const filterList = getAllSharesList.filter((element: Share) => element.target === "user")
                userList = filterList.filter((element: Share) => element.owner_id === +user.user_id)
            }


            if (request.body.target === "group") {
                const filterList = getAllSharesList.filter((element: Share) => element.target === "group")
                userList = filterList.filter((element: Share) => element.owner_id === +user.user_id)
            }

            await Promise.all(
                userList.map(async(el: Share) => {
                    const id = el.target_id
                    const user = await this.userService.findOne("id", id, false)
                    const nickname = user.nickname
                    return list.push({id, nickname})
                })
            )
           
            return list

        } catch (error) {
            response.status(400).json({ error: error.message })
        }


    }

    // Récupérer une liste des datas partagé avec l’utilisateur ou le groupe lié
    async getShares(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            
            const getAllDatas = await this.dataService.all()
            console.log("🚀 ~ file: ShareController.ts:75 ~ ShareController ~ getShares ~ getAllDatas:", getAllDatas)
            


        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    }


    // Récupération d'un partage par son id
    async getShareById(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            const share = await this.shareService.getShareById(id)
            return share
        }
        catch (error) {
            console.log("🚀 ~ file: AuthController.ts:23 ~ AuthController ~ getAuthById ~ error:", error)
        }
    }

    //Supprimer une share
    async removeShare(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            let authToRemove = await this.shareService.getShareById(id)

            if (!authToRemove) {
                throw new Error("this authorization not exist")
            }

            await this.shareService.remove(id)
            return "share has been removed"
        }
        catch (error) {
            console.log("🚀 ~ file: AuthController.ts:103 ~ AuthController ~ remove ~ error:", error)
        }
    }

}