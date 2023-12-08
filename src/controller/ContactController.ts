import { NextFunction, Response } from "express";
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
    async all(request: RequestWithUser, response: Response, next: NextFunction){ //: Promise<ResponseInterface>
        try{
            // Récupérer le userId grace au token
            const userId = parseInt(request.user.user_id);
            //Récupérer sa liste de contacts quand il est user1
            const listUserOne = await this.contactService.allByUserRole("user1_id", userId);
            //Vérifier qu'elle n'est pas vide
            let allUserOneEmpty = false;
            if(listUserOne.length === 0 || !listUserOne || listUserOne === null){
                allUserOneEmpty = true
            }

            //Récupérer sa liste de contacts quand il est user2
            const listUserTwo = await this.contactService.allByUserRole("user2_id", userId);
            //Vérifier qu'elle n'est pas vide
            let allUserTwoEmpty = false;
            if(listUserTwo.length === 0 || !listUserTwo || listUserTwo === null){
                allUserTwoEmpty = true
            }

            //tester que l'on a  récupéré des contacts
            if(allUserTwoEmpty === true && allUserTwoEmpty === true){
                throw new Error("Contacts not found");
            }

            //Formater les contacts
            let allUserOne=[];
            if(allUserOneEmpty === false){
                allUserOne = await this.contactService.returnContactList(listUserOne, "user1_id", "user2_id", "user2");
            }
            let allUserTwo=[];
            if(allUserTwoEmpty === false){
                allUserTwo = await this.contactService.returnContactList(listUserTwo, "user2_id", "user1_id", "user1");
            }

            //Renvoyer les contacts
            const contacts = {allUserOne, allUserTwo};
            if(!contacts || contacts === null || contacts.allUserOne.length === 0 && contacts.allUserTwo.length === 0){
                throw new Error("Error while fetching contacts.")
            }
            return this.responseMaker.responseSuccess(200, "Contacts found for the user", contacts);
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
            const otherUserId = parseInt(request.body.otherUser_id)

            //Verification User1 n'est pas le même que User2
            if(userId === otherUserId){
                throw new Error("User1 and User2 are the same user")
            }

            //Verifier que ces users ne sont pas deja en contact
            const testContact = await this.contactService.oneByUsers(userId, otherUserId);
            if (testContact){
                throw new Error("Users are already in contact")
            }

            //Verifications que les user existent (1 et 2)
            const user1Ok = await this.userService.findOne("id", userId, false);
            const user2Ok = await this.userService.findOne("id", otherUserId, false);
            if(!user1Ok || !user2Ok){
                throw new Error("One of the users, or the two don't exist")
            }
            
            //Execution de la fonction
            const contact = await this.contactService.create(userId, otherUserId);
            if (!contact){
                throw new Error("Bad request")
            }

            //Suprimer la validation
            await this.validationService.remove(validationId);
            const removedValidation = await this.validationService.oneById(validationId);
            if(removedValidation === null){
                return this.responseMaker.responseSuccess(201, "users are now contacts", contact)
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
            return this.responseMaker.responseSuccess(200, `contact was deleted`, removedcontact)
        }
        catch (error){
            response.status(500).json({ error: error.message })
        }
    }
}

//Test commit ssh