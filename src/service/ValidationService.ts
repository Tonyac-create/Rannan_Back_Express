import { AppDataSource } from "../data-source";
import { Validation } from "../entity/Validation";

export class ValidationService{
    private ValidationRepostiory = AppDataSource.getRepository(Validation)

    //Création d'une validation entre 2 users (demande pour ajouter l'user à nos contact)
    async create(userId: number, contactId: number, status: number) : Promise<Validation | {success: string; message: string}>{
        try{
            const newValidation = this.ValidationRepostiory.create({
                user: {id: userId},
                contact: {id: contactId},
                status: status
            });
            return await this.ValidationRepostiory.save(newValidation);
        }
        catch(error){
            return{
                success:'ko',
                message: error.message
            };
        }
    }

    //Récupérer une validation spécifique entre 2 users
    async oneByUsers(userId: number, contactId: number): Promise<Validation[]>{
        const validation = await this.ValidationRepostiory.find({
            where:{
                user: {id: userId},
                contact: {id: contactId}
            }
        });
        return validation;
    }
}