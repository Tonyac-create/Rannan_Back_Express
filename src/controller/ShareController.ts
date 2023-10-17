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

// Enregistrer une nouvelle share
    // async createShare(request: Request, response: Response, next: NextFunction){
    //     //Récupérer les variables du corps de la reqUête
    //     const data_id = request.body.data_id;
    //     const target = request.body.target;
    //     const target_id = parseInt(request.body.target_id);

    //     try{
    //         //Récupérer la data et verifier qu'elle existe
    //         const data = await this.dataService.getOneById(data_id);
    //         console.log("🚀 ~ file: ShareController.ts:40 ~ ShareController ~ createShare ~ data:", data)
            
    //         if(!data){
    //             response.status(404).send("The data doesn't exist");
    //         } else {
    //             //Si la demande est pour un groupe (target === "group")
    //             if(target === "group"){
    //                 //Récupérer le groupe target pour vérifier qu'il existe
    //                 const targetedGroup = await this.groupService.oneGroup(target_id);
    //                 if(!targetedGroup){
    //                     response.status(404).send("Group not found");
    //                 }
    //                 else{
    //                     //Execution de la fonction
    //                     const authorization = await this.shareService.create(target, target_id);
    //                     if(!authorization){
    //                         response.status(400).send("Bad request")
    //                     }
    //                     else{
    //                         response.status(201).send("Authorization created :" + authorization)
    //                         //Service pour a lier l'autorisation à la data (data has auth)
    //                     }
    //                 }
    //             }
    //         }
    //         //Si la demande est pour un autre user (target === "user")
    //         if (target === "user") {
    //             //Récupér l'user et vérifier qu'il existe (atendre service)
    //             const targetedUser = await this.userService.findOne("id", target_id, false);
    //             if(!targetedUser){
    //                 response.status(404).send("Targeted user not found.")
    //             }
    //             else{
    //                 //Éxecution de la fonction
    //                 const authorization = await this.shareService.create(target, target_id);
    //                 if(!authorization){
    //                     response.status(400).send("Bad request")
    //                 }
    //                 else{
    //                     response.status(201).send("Authorization created :" + authorization)
    //                     //Service pour a lier l'autorisation à la data (data has auth)
    //                 }
    //             }
    //         } else {
    //             response.status(400).send("Bad request.")
    //         }
    //     }
    //     catch(error){
    //         console.error("Error in the uthorization creation", error);
    //         response.status(500).send("An error ocurred while creating the authorization");
    //     }
    // }

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