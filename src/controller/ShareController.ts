import { NextFunction, Request, Response } from "express";
import { ShareService } from "../service/ShareService";
import { UserService } from "../service/UserService";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { ResponseMaker } from "../utils/ResponseMaker"
import { publishMessage, requestMessage } from "../utils/nats-config";

export class ShareController {

    // Services
    private shareService = new ShareService()
    private responseMaker = new ResponseMaker()
    private userService = new UserService()

    async allShares(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            const id = request.user
            return await requestMessage('getAllShares', id)
        } catch (error) {
            return this.responseMaker.responseError(404, error.message)
        }
    }

    // Supprime la share en entier(ex: utile quand on supprime un contact avec quelqu'un, ça supprime la share)
    async removeShare(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            return await requestMessage('removeShare', id)
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

     //Supprimer une data dans share et une share dans data
    async removeDataInShare(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id

            const { data_id } = request.body

            return await requestMessage('removeDataInShare', { id, data_id })
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    // Création d'une share
    async createShare(request: RequestWithUser, response: Response, next: NextFunction) {
        try {

            const owner_id = request.user.user_id
            const { data_id, target, target_id } = request.body

            // Récupération de la data
            await requestMessage('getOneData', data_id)

            return await publishMessage('createShare', { target, target_id, owner_id, data_id })
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    // Récupération de la liste des users avec qui il y a un ou des partages
    async getListUsers(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            const user = request.user.user_id
            const target = request.body.target
            return await requestMessage('getListUsers', {user, target})
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    // Récupérer une liste des datas partagé avec l’utilisateur ou le groupe lié
    async getShares(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            const {target, target_id} = request.body
            
            return await requestMessage('getShares', {target, target_id})
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    async getSharesBetweenUsers(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            const userconnected = request.user
            const userId_profile = request.body
            
            return await requestMessage('getSharesBetweenUsers', {user_id: userconnected.user_id, userId_profile})
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }


    // Récupération d'un partage par son id
    async getShareById(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id

            return await requestMessage('getOneShare', id)
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

            // Fonction faites par Caye. A voir si besoin
    //Récupérer un share entre 2 users et le supprimer
    async deleteShareByUsers(request: RequestWithUser, response: Response, next: NextFunction){
        try{
            ///Récupération des users
            const currentUserId = parseInt(request.user.user_id);
            const otherUserId = parseInt(request.params.id);

            //Vérifier que currentUserId dfférent de otherUserId
            if(currentUserId === otherUserId){
                throw {status: 400, message: "User1 and User2 are the same user"}
            }

            //Verifier que les users existent
            const testCurrent = await this.userService.findOne("id", currentUserId, false);
            const testOther = await this.userService.findOne("id", otherUserId, false);
            if(!testCurrent || !testOther || !testCurrent && !testOther){
                throw {status: 400, message: "One of the users, or the two don't exist"}
            }

            //Récupérer le share entre les users
            const share = await this.shareService.oneByUsersId(currentUserId, otherUserId);
            console.log("🚀 ~ file: ShareController.ts:123 ~ ShareController ~ deleteShareByUsers ~ share:", share)
            console.log("sahre_id, l 124", share.id)
            if(!share){
                throw {status: 400, message: "Share not found."}
            }

            //Supprimer le share
            const removedShare = await this.shareService.remove(share.id);
            return this.responseMaker.responseSuccess(200, `share was deleted`, removedShare)
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

}