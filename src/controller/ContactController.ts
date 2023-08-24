import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { ContactService } from "../service/ContactService"

export class ContactController{
    private contactService = new ContactService();

    async all(request: Request, response: Response, next: NextFunction){
        try{
            return await this.contactService.all()
            // .then((contacts) => response.status(200).json(contacts))
            // .catch((error) => {
            //     response.status(400).json({error});
            // })
        }
        catch (error){
            error => response.status(500).json({error});
        }  
    }
    
    async one(request: Request, response: Response, next: NextFunction){
        try{
            return await this.contactService.one(+request.params.id)
            .then((contact) => {
                return response.status(200).json(contact);
            })
            .catch((error) => {
                return response.status(404).json({error}); //les users ne sont pas en contact
            })
        }
        catch (error){
            error => response.status(500).json({error});
        }  
    }

    async save(request: Request, response: Response, next: NextFunction){
        //Verification que les userid existent (1 et 2)
        try{
            return await this.contactService.create(request.body) 
            // .then(() => response.status(201).json({ message: 'The users are now contacts'}))
            // .catch( error => response.status(400).json({error}));
        }
        catch (error){
            error => response.status(500).json({error});
        }   
    }

    async remove(request: Request, response: Response, next: NextFunction){
        try{
            return await this.contactService.remove(+request.params.id)
            //401 pour non autorisé (celui qui fait la demabndo doit avoir son id dans l'objet contact) 200 pour le succès
        }
        catch (error){
            error => response.status(500).json({error});
        }  
    }
}
