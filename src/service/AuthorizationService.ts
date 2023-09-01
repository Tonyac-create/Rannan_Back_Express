import { AppDataSource } from "../data-source";
import { Authorization } from "../entity/Authorization";

export class AuthorizationService{
    private AuthorizationRepository = AppDataSource.getRepository(Authorization)

    //Création d'une autorisation
}