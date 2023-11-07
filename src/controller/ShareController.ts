import { NextFunction, Request, Response } from "express";
import { ShareService } from "../service/ShareService";
import { DataService } from "../service/DataService";
import { GroupService } from "../service/GroupService";
import { UserService } from "../service/UserService";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { Share } from "../entity/Share";
import { ResponseMaker } from "../utils/ResponseMaker"

export class ShareController {

    // Services
    private shareService = new ShareService()
    private responseMaker = new ResponseMaker()
    private userService = new UserService()

    // Récupération de tout les partages
    async allShares(request: Request, response: Response, next: NextFunction) {
        try {
            const shares = await this.shareService.allShares()
        } catch (error) {
            return this.responseMaker.responseError(400, error.message)
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
                if (filterList.length === 0) {
                    throw new Error("don't have user with share")                    
                }
                userList = filterList.filter((element: Share) => element.owner_id === +user.user_id)
            } 

            if (request.body.target === "group") {
                const filterList = getAllSharesList.filter((element: Share) => element.target === "group")
                if (filterList.length === 0) {
                    throw new Error("don't have group with share")                    
                }
                userList = filterList.filter((element: Share) => element.owner_id === +user.user_id)
            }

            await Promise.all(
                userList.map(async (el: Share) => {
                    const id = el.target_id
                    const user = await this.userService.findOne("id", id, false)
                    const nickname = user.nickname
                    return list.push({ id, nickname })
                })
            )
            return this.responseMaker.responseSuccess(201, "list ok", list)
        } catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }


    }

    // Récupérer une liste des datas partagé avec l’utilisateur ou le groupe lié
    async getShares(request: RequestWithUser, response: Response, next: NextFunction) {
        try {

            let shareList = []
            let list = []

            const shareData = await this.shareService.allByDatas("target_id", +request.body.target_id)
            shareData.filter((share) => share.owner_id === +request.user.user_id)

            if (request.body.target === "user") {
                const filterList = shareData.filter((element: Share) => element.target === "user")
                console.log("🚀 ~ file: ShareController.ts:82 ~ ShareController ~ getShares ~ filterList:", filterList)
                if (filterList.length === 0) {
                    throw new Error("don't have user with share")                    
                }
                shareList = filterList[0].datas
            }

            if (request.body.target === "group") {
                const filterList = shareData.filter((element: Share) => element.target === "group")
                if (filterList.length === 0) {
                    throw new Error("don't have group with share")                    
                }
                shareList = filterList[0].datas
            }

            shareList.map((data) => {
                const id = data.id
                const name = data.name
                const value = data.value
                return list.push({ id, name, value })
            })
            return this.responseMaker.responseSuccess(201, "list ok", list)
        } catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }
    }

    async getSharesBetweenUsers(request: RequestWithUser, response: Response, next: NextFunction) {
        try {

            let shareList = []
            let list = []
            
            // Récupération des ids correspondants à la requête
            const useridProfile = await this.userService.findOne("id", +request.body.userId_profile, true)
            const useridToken = await this.userService.findOne("id", +request.user.user_id, true)
            
            // Cherche les shares avec le target_id correspondant
            const shareData = await this.shareService.allByDatas("target_id", +request.body.userId_profile)
            
            // Tri par target user
            const filterListByUser = shareData.filter((data) => data.target === "user")
            
            filterListByUser.map((share) => {
                list.push(...share.datas)
            })
            
            list.map((data) => {
                const id = data.id
                const name = data.name
                const value = data.value
                return shareList.push({ id, name, value })
            })
            
            return this.responseMaker.responseSuccess(201, "list ok", shareList)
        } catch (error) {
            return this.responseMaker.responseError(400, error.message)
        }
    }


    // Récupération d'un partage par son id
    async getShareById(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id
            const share = await this.shareService.getShareById(id)
            return this.responseMaker.responseSuccess(201, "share ok", share)
        }
        catch (error) {
            return this.responseMaker.responseError(400, error.message)
        }
    }

}