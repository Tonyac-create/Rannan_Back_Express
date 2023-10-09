import { NextFunction, Request, Response } from "express";
import { ValidationService } from "../service/ValidationService";
import { UserService } from "../service/UserService";
import { ResponseMaker } from "../utils/ResponseMaker";

export class ValidationController{

// Services
    private validationService = new ValidationService();
    private userService = new UserService();
    private responseMaker = new ResponseMaker();;

//Récupérer toutes les demandes envoyées par un user
    async allByUser(request: Request, response: Response, next: NextFunction){
        //Récupérer l'id de l'user à partir du token (attendre)
        try{
            const validations = await this.validationService.allByUserId(+request.params.id);
            if(!validations || validations.length === 0){
                throw new Error("no validations found");
            }
            else{
                return this.responseMaker.responseSuccess("Validations found", validations)
            }
        }
        catch(error){
            response.status(500).json({error :error.message, date : new Date()})
        }
    }

//Récupérer toutes les demandes envoyées reçues par un user
    async allByContact(request: Request, response: Response, next: NextFunction){
        //Récupérer l'id de l'user à partir du token (attendre)
        try{
            const validations = await this.validationService.allByContactId(+request.params.id);
            if(!validations || validations.length === 0){
                throw new Error("no validations found");
            }
            else{
                return this.responseMaker.responseSuccess("Validations found", validations)
            }
        }
        catch(error){
            response.status(500).json({error :error.message, date : new Date()})
        }
    }

//Création d'une demande de mise en contact entre 2 users
    async save(request: Request, response: Response, next: NextFunction){
        //Récupération des id des users
        const userId = parseInt(request.body.userId); //Quand token crée modifier pour l'obtenir depuis le token
        const contactId = parseInt(request.body.contactId);
        const status = 0;
        try{
            //Verification que les users existent
            const userOk = await this.userService.findOne("id", userId, false);
            const contactOk = await this.userService.findOne("id", contactId, false);
            if(!userOk || !contactOk || !userOk && !contactOk){
                throw new Error("One of the users, or the two don't exist")
            }
            //Verifier que user n'est pas le même qeu contact
            if( userOk.id === contactOk.id){
                throw new Error("User and Contact are the same user");
            }
            //Verifier qu'il n'y a pas une demande entre ces users
            const testValidation = await this.validationService.oneByUsers(userId, contactId);
            if(testValidation){
                console.log(testValidation);
                throw new Error("A contact request exists already")
            }
            //Execution de la fonction
            const validation = await this.validationService.create(userId, contactId, status);
            if (!validation){
                throw new Error("Bad request")
            }
            return this.responseMaker.responseSuccess("Contact request sent", validation) 
        }
        catch(error){
            response.status(500).json({error :error.message, date : new Date()})
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
            if(!targetValidation){
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
            response.status(500).json({error :error.message, date : new Date()})
        }    
    }

//Supprimer une validation
    async remove(request: Request, response: Response, next: NextFunction){
        //Récupérer l'id de l'user depuis le token et verifier qu'il correspond à celui de contact (Attendre token auth)
        //401 pour non authorisé
        try{
            const validation = await this.validationService.oneById(+request.params.id)
            await this.validationService.remove(validation);
            return this.responseMaker.responseSuccess("Validation deleted", validation)
        }
        catch(error){
            response.status(500).json({error :error.message, date : new Date()})
        } 
    }

}