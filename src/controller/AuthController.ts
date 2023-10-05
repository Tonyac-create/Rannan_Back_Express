import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { DataService } from "../service/DataService";
import { GroupService } from "../service/GroupService";
import { UserService } from "../service/UserService";

export class AuthController{
    private authService = new AuthService()
    private dataService = new DataService()
    private groupService = new GroupService()
    private userService = new UserService()

//Création d'une autorisation pour un user
    async createAuthorization(request: Request, response: Response, next: NextFunction){
        //Récupérer les variables du corps de la reqête
        const data_id = request.body.data_id;
        const target = request.body.target;
        const target_id = parseInt(request.body.target_id);

        try{
            //Récupérer la data et verifier qu'elle existe
            const data = await this.dataService.getOne(data_id);
            if(!data){
                response.status(404).send("The data doesn't exist");
            } else {
                //Si la demande est pour un groupe (target === "group")
                if(target === "group"){
                    //Récupérer le groupe target pour vérifier qu'il existe
                    const targetedGroup = await this.groupService.findOne(target_id);
                    if(!targetedGroup){
                        response.status(404).send("Group not found");
                    }
                    else{
                        //Execution de la fonction
                        const authorization = await this.authService.create(target, target_id);
                        if(!authorization){
                            response.status(400).send("Bad request")
                        }
                        else{
                            response.status(201).send("Authorization created :" + authorization)
                            //Service pour a lier l'autorisation à la data (data has auth)
                        }
                    }
                }
            }
            //Si la demande est pour un autre user (target === "user")
            if (target === "user") {
                //Récupér l'user et vérifier qu'il existe (atendre service)
                const targetedUser = await this.userService.oneById(target_id);
                if(!targetedUser){
                    response.status(404).send("Targeted user not found.")
                }
                else{
                    //Éxecution de la fonction
                    const authorization = await this.authService.create(target, target_id);
                    if(!authorization){
                        response.status(400).send("Bad request")
                    }
                    else{
                        response.status(201).send("Authorization created :" + authorization)
                        //Service pour a lier l'autorisation à la data (data has auth)
                    }
                }
            } else {
                response.status(400).send("Bad request.")
            }
        }
        catch(error){
            console.error("Error in the uthorization creation", error);
            response.status(500).send("An error ocurred while creating the authorization");
        }
    }

    //Récupération de toutes les authorisations qu'un user a donné (id createur)

    //Récupération de toutes les authorisations qu'un user a reçu (id du target)

    //Récupération de toutes les authorisations qu'un groupe a (id du groupe)

    //Récupation de toutes les authorisations d'une data précise (id de la data)

    //Récupération d'un authorisation précise (id de l'authorisation)

    //Supprimer une authorisation
}