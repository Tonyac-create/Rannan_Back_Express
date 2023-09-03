import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { AuthorizationService } from "../service/AuthorizationService";
import { Data } from "../entity/Data";
import { Group } from "../entity/Group";
import { User } from "../entity/User";

export class AuthorizationController{
    private authorizationService = new AuthorizationService();
    private dataRepository = AppDataSource.getRepository(Data);
    private groupRepository = AppDataSource.getRepository(Group);
    private userRepository = AppDataSource.getRepository(User);

    //Création d'une autorisation pour un user
    async createAuthorization(request: Request, response: Response, next: NextFunction){
        //Récupérer les variables du corps de la reqête
        const data_id = request.body.data_id;
        const user_id = parseInt(request.body.user_id); //récupérer du token quand implémenté
        const target = parseInt(request.body.target);
        const target_id = parseInt(request.body.target);

        try{
            //Récupérer la data et verifier qu'elle existe (attendre services pour substituer)
            const data = await this.dataRepository.findBy(data_id);
            if(!data || data.length === 0){
                response.status(404).send("The data doesn't exist");
            }
            else{
                //Verifier que l'user qui fait la requête est le créateur de la data
                const dataCreator = parseInt(data.user.id); //Revoir
                if(dataCreator !== user_id){ //Revoir
                    response.status(401).send("Unauthorized");
                }
                else{
                    //Si la demande est pour un groupe (target === 1)
                    if(target === 1){
                        //Récupérer le groupe target pour vérifier qu'il existe (modifier quand service)
                        const targetedGroup = await this.groupRepository.find({where:{id : target_id}});
                        if(!targetedGroup || targetedGroup.length === 0){
                            response.status(404).send("Group not found");
                        }
                        else{
                            const groupCreator = parseInt(targetedGroup.creator.id); //Revoir
                            //Verifier que le créateur du groupe est bien l'user qui fait la requête
                            if (groupCreator !== user_id){
                                response.status(401).send("Unauthorized.");
                            }
                            else{
                                //Execution de la fonction
                                const authorzation = await this.authorizationService.create(target, target_id);
                                if(!authorzation){
                                    response.status(400).send("Bad request")
                                }
                                else{
                                    response.status(201).send(authorzation).send("Authorization created")
                                    //Service pour a lier l'autorisation à la data (data has auth)
                                }
                            }

                        }
                    }
                    //Si la demande est pour un autre user (target === 2)
                    if (target === 2){
                        //Récupér l'user et vérifier qu'il existe (atenndre service)
                        const targetedUser = await this.userRepository.find({where:{id : target_id}});
                        if(!targetedUser || targetedUser.length === 0){
                            response.status(404).send("Targeted user not found.")
                        }
                        else{
                            //Éxecution de la fonction
                            const authorzation = await this.authorizationService.create(target, target_id);
                            if(!authorzation){
                                response.status(400).send("Bad request")
                            }
                            else{
                                response.status(201).send(authorzation).send("Authorization created")
                                //Service pour a lier l'autorisation à la data (data has auth)
                            }
                        }
                    }
                    else{
                        response.status(400).send("Bad request.")
                    }
                }
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