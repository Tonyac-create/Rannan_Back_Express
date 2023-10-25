import { NextFunction, Request, Response } from "express";
import { ValidationService } from "../service/ValidationService";
import { UserService } from "../service/UserService";
import { ResponseMaker } from "../utils/ResponseMaker";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { ResponseInterface } from "../interface/ResponseInterface";

export class ValidationController{

// Services
    private validationService = new ValidationService();
    private userService = new UserService();
    private responseMaker = new ResponseMaker();

//Récupérer toutes les demandes de l'user reçues et envoyées
    async all(request: RequestWithUser, response: Response, next: NextFunction): Promise<ResponseInterface>{
        try{
            //Récupérer les requÊtes envoyées
            const sentValidations = await this.validationService.allByUserId(+request.user.user_id);
            let sentIsEmpty;
            if(!sentValidations || sentValidations.length === 0){
                sentIsEmpty = true
            }
            let allSent = [];
            await Promise.all(sentValidations.map(async(element) => {
                const targetUser = await this.userService.findOne("id", element.contact_id, false);
                const contact = this.validationService.contactFormated(targetUser);
                const validation = {
                    id: element.id,
                    user_id: element.user_id,
                    contact : contact
                }    
                allSent.push(validation);
            }))

            //Récupérer les requÊtes reçues
            const recievedValidations = await this.validationService.allByContactId(+request.user.user_id);
            let recievedIsEmpty;
            if(!recievedValidations || recievedValidations.length === 0){
                 recievedIsEmpty = true
            }
            let allRecieved = [];
            await Promise.all(recievedValidations.map(async(element) => {
                const targetUser = await this.userService.findOne("id", element.user_id, false);
                const user = this.validationService.userFormated(targetUser);
                const validation = {
                    id: element.id,
                    user: user,
                    contact_id : element.contact_id
                }    
                allRecieved.push(validation);
            }))

            //Mettre les 2 objets dans un tableau
            // let validations = [allSent, allRecieved];
            let validations = {allSent, allRecieved};

            if(!validations || validations === null || sentIsEmpty === true && recievedIsEmpty === true){
                throw new Error("no validations found")
            }
            return this.responseMaker.responseSuccess("Validations found", validations);
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
            const testValidation1 = await this.validationService.oneByUsers(userId, contactId);
            if(testValidation1){
                throw new Error("A contact request exists already")
            }
            const testValidation2 = await this.validationService.oneByUsers(contactId, userId);
            if(testValidation2){
                throw new Error("A contact request exists already")
            }
            //Execution de la fonction
            const validation = await this.validationService.create(userId, contactId);
            if (!validation){
                throw new Error("Bad request")
            }
            return this.responseMaker.responseSuccess("Contact request sent", validation) 
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
            if(validation.contact_id !== userId){
                throw new Error("Unauthorized")
            }
            const removedvalidation =  await this.validationService.remove(validation.id)
            return this.responseMaker.responseSuccess(`validation was deleted`, removedvalidation)
        }
        catch (error){
            console.log("🚀 ~ file: ValidationController.ts:91 ~ ValidationController ~ remove ~ error:", error)
            response.status(500).json({ error: error.message })
        }
    }
}