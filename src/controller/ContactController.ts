import { NextFunction, Request, Response } from "express";
import { ContactService } from "../service/ContactService";
import { UserService } from "../service/UserService";
import { ResponseInterface } from "../interface/ResponseInterface";
import { ResponseMaker } from "../utils/ResponseMaker";

export class ContactController{

// Services
    private contactService = new ContactService();
    private userService = new UserService();
    private responseMaker = new ResponseMaker();

// Récupérer la liste de contacts d'un utilisateur 
    async all(request: Request, response: Response, next: NextFunction){
        // Récupérer le userId grace au token (à faire)
        const userId = parseInt(request.params.id);
        try{
            const contacts =  await this.contactService.allByUserId(userId)
            if (!contacts || contacts.length === 0){
                response.status(404).send("No contacts found for this user");
            }
            else{
                response.status(200).send(contacts);
            }
        }
        catch (error){
            console.error("Error while fetching contacts by user id:", error);
            response.status(500).send("An error ocurred while fetching contacts by user Id");
        }  
    }

//Récupérer un contact spécifique entre 2 users par id de contact
    async one(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        try{
            const contact = await this.contactService.one(id);
            //Verification que la relation existe
            if(!contact || contact.length === 0){
                response.status(404).send("Contact not found");
            }
            else{
                response.status(200).send(contact);
            }
        }
        catch(error){
            console.error("Cannot fetch contact by Id:", error);
            response.status(500).send("An error ocurred while fetching contact by its id");
        }
    }

//Mettre 2 users en contact
    async save(request: Request, response: Response, next: NextFunction): Promise<ResponseInterface>{
        //Récupération user1 dans le token (à faire)
        try{

            //Verifications que les user existent (1 et 2)
            const user1Ok =await this.userService.findOne("id", +request.body.user1Id, false);
            const user2Ok = await this.userService.findOne("id", +request.body.user2Id, false);

            if(!user1Ok || !user2Ok){
                throw new Error("One of the users, or the two don't exist")
            }
            //User1 n'est pas le même que User2
            if(user1Ok.id === user2Ok.id){
                throw new Error("User1 and User2 are the same user")
            }
            
            //Verifier que ces users ne sont pas deja en contact
            const testContact = await this.contactService.oneByUsers(+request.body.user1Id, +request.body.user2Id);
            if (testContact){
                throw new Error("Users are already in contact")
            }
            //Execution de la fonction
            const contact = await this.contactService.create(+request.body.user1Id, +request.body.user2Id);
            if (!contact){
                throw new Error("Bad request")
            }
            return this.responseMaker.responseSuccess("users are now contacts", contact)
            
        }
        catch(error){
            response.status(400).json({error :error.message, date : new Date()})
        }  
    }

//Eliminer un user de ses contacts 
    async remove(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        //Récupérer l'id de l'user depuis le token et verifier qu'il correspond à user1 (Attendre token auth)
        //401 pour non authorisé
        try{
            const removeResult = await this.contactService.remove(id)
            return removeResult;
        }
        catch (error){
            console.error("Error in the contact deletion:", error);
            response.status(500).send("An error ocurred while deletiing the contact");
        }  
    }
}