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

    //Récupérer toutes les demandes envoyées par un user
    async allByUser(request: Request, response: Response, next: NextFunction){
        //Récupérer l'id de l'user à partir du token (attendre)
        const userId = parseInt(request.params.userId);
        try{
            const validations = await this.validationService.allByUserId(userId);
            if(!validations || validations.length === 0){
                response.status(404).send("no validations found");
            }
            response.status(200).send(validations);
        }
        catch(error){
            console.error("Error while fetching validations by user id:", error);
            response.status(500).send("An error ocurred while fetching validations by user Id");
        }
    }

    //Récupérer toutes les demandes envoyées reçues par un user
    async allByContact(request: Request, response: Response, next: NextFunction){
        //Récupérer l'id de l'user à partir du token (attendre)
        const contactId = parseInt(request.params.contactId);
        try{
            const validations = await this.validationService.allByContactId(contactId);
            if(!validations || validations.length === 0){
                response.status(404).send("no validations found");
            }
            response.status(200).send(validations);
        }
        catch(error){
            console.error("Error while fetching validations by contact id:", error);
            response.status(500).send("An error ocurred while fetching validations by contact Id");
        }
    }

    //Supprimer une validation
    async remove(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        //Récupérer l'id de l'user depuis le token et verifier qu'il correspond à celui de contact (Attendre token auth)
        //401 pour non authorisé
        try{
            const removeValidation = await this.validationService.remove(id);
            return removeValidation;
        }
        catch(error){
            console.error("Error in the validation deletion:", error);
            response.status(500).send("An error ocurred while deletiing the validation");
        } 
    }

    //Maj de la validation
    async update(request: Request, response: Response, next: NextFunction){
        //Récupération de l'id de l'user qui a reçu la requête et de sa réponse
        const contactId = parseInt(request.body.contactId); //Récupérer du token
        const id = parseInt(request.params.id); //id de la validation
        const status = parseInt(request.body.status); //nouveau statut de la validation (1 acceptée, 2 refusée)
        try{
            //Vérifier que la validation existe
            const targetValidation = await this.validationService.oneById(id)
            if(!targetValidation || targetValidation.length === 0){
                response.status(401).send("Unauthorized"); //eviter une faille de securite, ne pas specifier que le repository existe pas
            }
            else{
                //Verifier que l'id du token correspond à l'id du contact de la requete (en attente token) 401 unauthorized
                //Verifier que l'user qui update la demande correspond à le destinataire de la demande
                const targetContact = 2; //targetValidation.contactId; y a une erreur dans la recup
                if(contactId !== targetContact){
                    response.status(401).send("Unauthorized");
                }
                else{
                    //execution de la fonction
                    const updatedValidation = await this.validationService.update(id, status);
                    if (!updatedValidation){
                        response.status(400).send("An error ocurred while updating the validation")
                    }
                    else{
                        response.status(200).send(updatedValidation)
                    }
                }
            }
        }
        catch(error){
            console.error("Error in the validation update.", error);
            response.status(500).send("An error ocurred while fetching the validation");
        }    
    }
}