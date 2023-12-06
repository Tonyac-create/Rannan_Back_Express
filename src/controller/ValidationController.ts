import { NextFunction, Response } from "express";
import { ValidationService } from "../service/ValidationService";
import { UserService } from "../service/UserService";
import { ResponseMaker } from "../utils/ResponseMaker";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { ResponseInterface } from "../interface/ResponseInterface";
import { ContactService } from "../service/ContactService";

export class ValidationController{

// Services
    private validationService = new ValidationService();
    private userService = new UserService();
    private contactService = new ContactService();
    private responseMaker = new ResponseMaker();

//Récupérer toutes les demandes de l'user reçues et envoyées
    async all(request: RequestWithUser, response: Response, next: NextFunction): Promise<ResponseInterface>{
        try{
            // Récupérer le userId grace au token
            const userId = parseInt(request.user.user_id);
            //Récupérer la liste de validations envoyées
            const sentValidations = await this.validationService.allByUserRole("user_id", userId);
            //Vérifier qu'elle n'est pas vide
            let sentIsEmpty = false;
            if(sentValidations.length === 0 || !sentValidations || sentValidations === null){
                sentIsEmpty = true;
            }

            //Récupérer la liste de validations reçues
            const recievedValidations = await this.validationService.allByUserRole("contact_id", userId)
            //Verifier qu'elle n'est pas vide
            let recievedIsEmpty = false;
            if(recievedValidations.length === 0 || !recievedValidations || recievedValidations === null){
                recievedIsEmpty = true;
            }

            //Tester qu'on a récupéré des contacts
            if(sentIsEmpty === true && recievedIsEmpty === true){
                throw new Error("Validations not found");
            }

            //Formater les validations
            let allSent = [];
            if(sentIsEmpty === false){
                allSent = await this.validationService.returnValidationtList(sentValidations, "user_id", "contact_id", "contact");
            }
            let allRecieved = [];
            if(recievedIsEmpty === false){
                allRecieved = await this.validationService.returnValidationtList(recievedValidations, "contact_id", "user_id", "user");
            }

            //Renvoyer les validations
            const validations = {allSent, allRecieved};
            if(!validations || validations === null || validations.allSent.length === 0 && validations.allRecieved.length === 0){
                throw new Error("Error while fetching validations.")
            }
            return this.responseMaker.responseSuccess(200, "Validations found", validations);
        }
        catch(error){
            console.log("🚀 ~ file: ValidationController.ts:31 ~ ValidationController ~ all ~ error:", error);
            response.status(500).json({error :error.message, date : new Date()});
        }
    }

//Création d'une demande de mise en contact entre 2 users
    async save(request: RequestWithUser, response: Response, next: NextFunction): Promise<ResponseInterface>{
        //Récupération des id des users
        const userId = parseInt(request.user.user_id);
        const contactId = parseInt(request.body.contactId);
        try{
            //Verifier que user n'est pas le même qeu contact
            if( userId === contactId){
                throw new Error("User and Contact are the same user");
            }

            //Verifier qu'il n'y a pas un contact entre les users
            const testContact = await this.contactService.oneByUsers(userId, contactId);
            if(testContact){
                throw new Error("Users are in contact");
            }
            
            //Verifier qu'il n'y a pas une demande entre ces users
            const testValidation = await this.validationService.oneByUsers(userId, contactId);
            if(testValidation){
                throw new Error("A contact request exists already")
            }

            //Verification que les users existent
            const userOk = await this.userService.findOne("id", userId, false);
            const contactOk = await this.userService.findOne("id", contactId, false);
            if(!userOk || !contactOk || !userOk && !contactOk){
                throw new Error("One of the users, or the two don't exist")
            }
            
            //Execution de la fonction
            const validation = await this.validationService.create(userId, contactId);
            if (!validation){
                throw new Error("Bad request")
            }
            return this.responseMaker.responseSuccess(201, "Contact request sent", validation) 
        }
        catch(error){
            console.log("🚀 ~ file: ValidationController.ts:69 ~ ValidationController ~ save ~ error:", error)
            response.status(500).json({error :error.message, date : new Date()})
        }
    }

//Supprimer une validation
    async remove(request: RequestWithUser, response: Response, next: NextFunction) {
        try{
            //Verifier que la validation existe
            const validation = await this.validationService.oneById(+request.params.id)
            if (!validation){
                throw new Error("validation not found")
            }
            //verifier que le user qui suprime est bien le destinataire de la demande
            const userId = parseInt(request.user.user_id);
            console.log("🚀 ~ file: ValidationController.ts:132 ~ ValidationController ~ remove ~ userId:", userId)
            if(validation.contact_id !== userId && validation.user_id !== userId){
                throw new Error("Unauthorized")
            }
            const removedvalidation =  await this.validationService.remove(validation.id)
            return this.responseMaker.responseSuccess(201, `validation was deleted`, removedvalidation)
        }
        catch (error){
            console.log("🚀 ~ file: ValidationController.ts:91 ~ ValidationController ~ remove ~ error:", error)
            response.status(500).json({ error: error.message })
        }
    }
}