import { AppDataSource } from "../data-source";
import { Validation } from "../entity/Validation";

export class ValidationService{
    private ValidationRepostiory = AppDataSource.getRepository(Validation)

    //Création d'une validation entre 2 users (demande pour ajouter l'user à nos contact)
    async create(userId: number, contactId: number, status: number) : Promise<Validation | {success: string; message: string}>{
        try{
            const newValidation = this.ValidationRepostiory.create({
                userId: {id: userId},
                contactId: {id: contactId},
                validation: status
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
                userId: {id: userId},
                contactId: {id: contactId}
            }
        });
        return validation;
    }

    //Récupérer une validation spécifique entre 2 users par id de la validation
    async oneById(id: number): Promise<Validation[]>{
        const validation = await this.ValidationRepostiory.findBy({id});
        return validation;
    }

    //Récupérer toutes les demandes envoyées par un user
    async allByUserId(userId: number): Promise<Validation[]>{
        const validations = await this.ValidationRepostiory.find({
            where: {userId: {id: userId}}
        });
        return validations;
    }

    //Récupérer toutes les demandes reçues 
    async allByContactId(contactId: number): Promise<Validation[]>{
        const validations = await this.ValidationRepostiory.find({
            where: {contactId: {id: contactId}}
        });
        return validations;
    }

    //Éliminer une demande de mise en contact
    async remove(id: number): Promise<string>{
        const validationToRemove = await this.ValidationRepostiory.findBy({id});
        if (!validationToRemove || validationToRemove.length === 0){
            throw new Error("Validation not found.")
        }
        await this.ValidationRepostiory.remove(validationToRemove);
        return "Validation has been removed";
    }

    //MaJ d'une validation (répondre à celle-ci)
    async update(id: number, status: number): Promise<Validation[] | {success: string; message: string}>{
        try{
            await this.ValidationRepostiory.update(id, {validation: status});
            const validation = await this.oneById(id);
            return validation;           
        }
        catch(error){
            return{
                success:'ko',
                message: error.message
            };
        }
    }
}