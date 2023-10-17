import { NextFunction, Request, Response } from "express";
import { ShareService } from "../service/ShareService";
import { DataService } from "../service/DataService";
import { GroupService } from "../service/GroupService";
import { UserService } from "../service/UserService";

export class ShareController{

// Services
    private shareService = new ShareService()
    private dataService = new DataService()
    private groupService = new GroupService()
    private userService = new UserService()

// Récupération de tout les partages d'une target (BODY : target = "group" ou "user" / id = target_id)

// Récupére la liste des utilisateurs avec qui le user a des partages


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
                throw new Error ("this authorization not exist")
            }

            await this.shareService.remove(id)
            return "share has been removed"
        }
        catch (error) {
            console.log("🚀 ~ file: AuthController.ts:103 ~ AuthController ~ remove ~ error:", error)
        }
    }

}