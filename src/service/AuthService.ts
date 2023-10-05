import { AppDataSource } from "../data-source";
import { Authorization } from "../entity/Authorization";

export class AuthService{
    private AuthorizationRepository = AppDataSource.getRepository(Authorization)

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

    //Récupération de toutes les authorisations qu'un user a donné (id createur)

    //Récupération de toutes les authorisations qu'un user a reçu (id du target)

    //Récupération de toutes les authorisations qu'un groupe a (id du groupe)

    //Récupation de toutes les authorisations d'une data précise (id de la data)

    //Récupération d'un authorisation précise (id de l'authorisation)

    //Supprimer une authorisation

}