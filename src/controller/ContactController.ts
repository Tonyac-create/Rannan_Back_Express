import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { ContactService } from "../service/ContactService";
import { User } from "../entity/User";

export class ContactController{
    private contactService = new ContactService();
    private userRepository = AppDataSource.getRepository(User);

    //Récupérer la liste de contacts d'un utilisateur
    async all(request: Request, response: Response, next: NextFunction){
        const userId = parseInt(request.params.id);
        try{
            const contacts =  this.contactService.allByUserId(userId)
            if (!contacts){
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
    
    //Récupérer un contact spécifique de l'user
    async one(request: Request, response: Response, next: NextFunction){
        const userId = parseInt (request.body.user2Id);
        try{
           
            //Vérifier que le user de la requette existe
            const user = await this.userRepository.findOneBy({id: userId});
            if (!user){
                response.status(400).send("The user id is not valid")
            }

            else{
                try{
                    const contact = await this.contactService.one(userId);

                    //Verification que les users sont en contact
                    if(!contact){
                        response.status(404).send("Contact not found");
                    }

                    else{
                        response.status(200).send(contact);
                    }
                }
                catch(error){
                    console.error("Cannot fetch contact by userId:", error);
                    response.status(500).send("An error ocurred while fetching contacts by userId");
                }
            }
        }
        catch(error){
            console.error("Cannot fetch contact by userId:", error);
            response.status(500).send("An error ocurred while fetching contacts by userId");
        }
    }  

    //Récupérer un contact spécifique entre 2 users
    async oneByRelation(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        try{
            const contact = await this.contactService.oneByRelation(id);

            //Verification que la relation existe
            if(!contact){
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
        const user1Id = parseInt(request.body.user1Id);
        const user2Id = parseInt(request.body.user2Id);
        try{
            //Verifications que les userid existent (1 et 2)
            const user1Ok = await this.userRepository.findOneBy({id: user1Id});
            const user2Ok = await this.userRepository.findOneBy({id: user2Id});
            if(!user1Ok || !user2Ok || !user1Ok && !user2Ok){
                response.status(404).send("One of the users, or the two don't exist") 
            }
            else{
                //User1 n'est pas le même que User2
                if(user1Ok === user2Ok){
                response.status(400).send("User1 and User2 are the same user")
                }

                else{ //Execution de la fonction
                    try{
                        const contact = await this.contactService.create(user1Id, user2Id);
                        if (!contact){
                            response.status(400).send("Bad request")
                        }
                        else{
                            response.status(201).send(contact).send("users are now contacts")  
                        }   
                    }
                    catch(error){
                        console.error("Error in the contact creation:", error);
                        response.status(500).send("An error ocurred while fetching contacts");
                    }
                }
            }
        }
        catch(error){
            console.error("Error in the contact creation:", error);
            response.status(500).send("An error ocurred while fetching contacts");
            console.log("erreur l123");
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