import { NextFunction, Request, Response } from "express";
import { ContactService } from "../service/ContactService";
import { UserService } from "../service/UserService";

export class ContactController{

// Services
    private contactService = new ContactService();
    private userService = new UserService();

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
    async save(request: Request, response: Response, next: NextFunction){
        //Récupération user1 dans le token (à faire)
        const user1Id = parseInt(request.body.user1Id);
        const user2Id = parseInt(request.body.user2Id);
        try{
            //Verifications que les user existent (1 et 2)
            const user1Ok =await this.userService.findOne("id", user1Id, false);
            const user2Ok = await this.userService.findOne("id", user2Id, false);
            if(!user1Ok || !user2Ok || !user1Ok && !user2Ok){
                response.status(404).send("One of the users, or the two don't exist")
            }
            else{
                //User1 n'est pas le même que User2
                if(user1Ok.id === user2Ok.id){
                    response.status(400).send("User1 and User2 are the same user")
                }
                else{
                    //Verifier que ces users ne sont pas deja en contact
                    let usersAreInContact;
                    const contact = await this.contactService.oneByUsers(user1Id, user2Id);
                    if (!contact || contact.length === 0){
                        usersAreInContact = false;
                    }
                    else{
                        usersAreInContact = true;
                    }
                    console.log(usersAreInContact);
                    if(usersAreInContact === true){
                        response.status(400).send("Users are already in contact");
                    }
                    else{ //Execution de la fonction
                        const contact = await this.contactService.create(user1Id, user2Id);
                        if (!contact){
                            response.status(400).send("Bad request")
                        }
                        else{
                            response.status(201).send(contact).send("users are now contacts")
                        }
                    }
                }
            }
        }
        catch(error){
            console.error("Error in the contact creation:", error);
            response.status(500).send("An error ocurred while fetching contacts");
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