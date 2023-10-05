import { AppDataSource } from "../data-source";
import { Authorization } from "../entity/Authorization";

export class AuthService{

    private AuthorizationRepository = AppDataSource.getRepository(Authorization)

// Récupération de toutes les authorisations d'une target (BODY : target = "group" ou "user" / id = target_id)

// Récupération d'une authorisation par son id


//Création d'une autorisation
    async create(target: string, target_id:number) : Promise<Authorization | {success: string; message: string}>{
        try{
            const newAuthorization = this.AuthorizationRepository.create({
                target: target,
                target_id: target_id
            });
            return await this.AuthorizationRepository.save(newAuthorization);
        }
        catch(error){
            return{
                success:'ko',
                message: error.message
            };
        }
    }

    //Lier la data et l'authorisation

    //Supprimer une authorisation

}