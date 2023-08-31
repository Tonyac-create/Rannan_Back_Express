import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { ValidationService } from "../service/ValidationService";
import { User } from "../entity/User";

export class ValidationController{
    private validationService = new ValidationService();
    private userRepository = AppDataSource.getRepository(User);

    //Création d'une demande de mise en contact entre 2 users
    async save(request: Request, response: Response, next: NextFunction){
        //Récupération des id des users
        const userId = parseInt(request.body.userId); //Quand token crée modifier pour l'obtenir depuis le token
        const contactId = parseInt(request.body.contactId);
        const status = 0;
        try{
            //Verification que les users existent
            const userOk = await this.userRepository.findOneBy({id: userId});
            const contactOk = await this.userRepository.findOneBy({id: contactId});
            if(!userOk || !contactOk || !userOk && !contactOk){
                response.status(404).send("One of the users, or the two don't exist")
            }
            else{
                //Verifier que user n'est pas le même qeu contact
                if( userOk.id === contactOk.id){
                    response.status(400).send("User and Contact are the same user");
                }
                else{
                    //Verifier qu'il n'y a pas une demande entre ces users
                    let validationExists;
                    const validation = await this.validationService.oneByUsers(userId, contactId);
                    if(!validation || validation.length === 0){
                        const validation = await this.validationService.oneByUsers(contactId, userId);
                        if(!validation || validation.length === 0){
                            validationExists = false
                        }
                        else{
                            validationExists = true;
                        }
                    }
                    else{
                        validationExists = true;
                    }
                    if( validationExists === true){
                        response.status(400).send("A contact request exists already")
                    }
                    else{ //Execution de la fonction
                        const validation = await this.validationService.create(userId, contactId, status);
                        if (!validation){
                            response.status(400).send("Bad request");
                        }
                        response.status(201).send(validation).send("request sent")
                    }

                }
            }
        }
        catch(error){
            console.error("Error in the validation creation:", error);
            response.status(500).send("An error ocurred while fetching the validation");
        }
    }
}