import { NextFunction, Request, Response } from "express";
import { ContactService } from "../service/ContactService";
import { UserService } from "../service/UserService";
import { ResponseInterface } from "../interface/ResponseInterface";
import { ResponseMaker } from "../utils/ResponseMaker";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { ValidationService } from "../service/ValidationService";

export class ContactController{

// Services
    private contactService = new ContactService();
    private userService = new UserService();
    private validationService = new ValidationService();
    private responseMaker = new ResponseMaker();

// Récupérer la liste de contacts d'un utilisateur 
    async all(request: RequestWithUser, response: Response, next: NextFunction): Promise<ResponseInterface>{
        try{
            // Récupérer le userId grace au token
            const userId = parseInt(request.user.user_id);
            //Récupérer sa liste de contacts quand il est user1
            const listUserOne = await this.contactService.allByUserRole("user1_id", userId);
            let allUserOne = [];
            await Promise.all(listUserOne.map(async(element) => {
                const targetUser = await this.userService.findOne("id", element.user2_id, false);
                const user2 = this.contactService.user2Formated(targetUser);
                const contact = {
                    id: element.id,
                    user1_id: element.user1_id,
                    user2 : user2
                }    
                allUserOne.push(contact);
            }))

            //Récupérer sa liste de contacts quand il est user2
            const listUserTwo = await this.contactService.allByUserRole("user2_id", userId);
            let allUserTwo = [];
            await Promise.all(listUserTwo.map(async(element) => {
                const targetUser = await this.userService.findOne("id", element.user1_id, false);
                const user1 = this.contactService.user1Formated(targetUser);
                const contact = {
                    id: element.id,
                    user1: user1,
                    user2_id: element.user2_id
                }    
                allUserTwo.push(contact);
            }))
            // const contacts = [...allUserOne, ...allUserTwo]
            const contacts = {allUserOne, allUserTwo}
            // if(contacts === null || contacts.length === 0){
            if(contacts === null){
                throw new Error("Contacts not found")
            }
            return this.responseMaker.responseSuccess("Contacts found for the user", contacts);
        }
        catch (error){
            console.log("🚀 ~ file: ContactController.ts:29 ~ ContactController ~ all ~ error:", error);
            response.status(500).json({error :error.message, date : new Date()})
        }  
    }

//Mettre 2 users en contact (et suprimer la validation associée à ces 2 users)
    async save(request: RequestWithUser, response: Response, next: NextFunction): Promise<ResponseInterface>{
        try{
            const userId = parseInt(request.user.user_id);
            const validationId = parseInt(request.body.validation_id); //Récupérée en front dans la key de la card
            //Verifications que les user existent (1 et 2)
            const user1Ok =await this.userService.findOne("id", userId, false);
            const user2Ok = await this.userService.findOne("id", +request.body.user2Id, false);

            if(!user1Ok || !user2Ok){
                throw new Error("One of the users, or the two don't exist")
            }
            //User1 n'est pas le même que User2
            if(user1Ok.id === user2Ok.id){
                throw new Error("User1 and User2 are the same user")
            }
            
            //Verifier que ces users ne sont pas deja en contact
            const testContact = await this.contactService.oneByUsers(userId, +request.body.user2Id);
            if (testContact){
                throw new Error("Users are already in contact")
            }
            //Execution de la fonction
            const contact = await this.contactService.create(userId, +request.body.user2Id);
            if (!contact){
                throw new Error("Bad request")
            }

            //Suprimer la validation
            await this.validationService.remove(validationId);
            const removedValidation = await this.validationService.oneById(validationId);
            if(removedValidation === null){
                return this.responseMaker.responseSuccess("users are now contacts", contact)
            }
            else{
                throw new Error("Error while deleting the validation")
            }    
        }
        catch(error){
            console.log("🚀 ~ file: ContactController.ts:76 ~ ContactController ~ save ~ error:", error);
            response.status(500).json({error :error.message, date : new Date()})
        }  
    }

//Eliminer un user de ses contacts 
    async remove(request: RequestWithUser, response: Response, next: NextFunction) {
        try{
            const contact = await this.contactService.oneById(+request.params.id)
            if (!contact){
                throw new Error("contact not found")
            }
            const userId = parseInt(request.user.user_id);
            if(contact.user1_id !== userId && contact.user2_id !== userId){
                throw new Error("Unauthorized")
            }
            const removedcontact =  await this.contactService.remove(contact.id)
            return this.responseMaker.responseSuccess(`contact was deleted`, removedcontact)
        }
        catch (error){
            response.status(500).json({ error: error.message })
        }
    }
}