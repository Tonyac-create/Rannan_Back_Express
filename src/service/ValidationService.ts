import { AppDataSource } from "../data-source";
import { Validation } from "../entity/Validation";

export class ValidationService{
    private ValidationRepostiory = AppDataSource.getRepository(Validation)

    //Création d'une validation entre 2 users (demande pour ajouter l'user à nos contact)
    async create(userId: number, contactId: number, status: number) : Promise<Validation>{
        try{
            const newValidation = this.ValidationRepostiory.create({
                user_id: userId,
                contact_id: contactId,
                validation: status
            });
            return await this.ValidationRepostiory.save(newValidation);
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:19 ~ ValidationService ~ create ~ error:", error);
            throw new Error(error)
        }
    }

    //Récupérer une validation spécifique entre 2 users
    async oneByUsers(userId: number, contactId: number): Promise<Validation[]>{
        try{
            const validation = await this.ValidationRepostiory.find(
                {where:{
                    user_id: userId,
                    contact_id: contactId
                }}
                ||{where:{
                    user_id: contactId,
                    contact_id: userId
                }}
            );
        return validation;
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:35 ~ ValidationService ~ oneByUsers ~ error:", error);
            throw new Error(error)
        }
    }

    //Récupérer une validation spécifique entre 2 users par id de la validation
    async oneById(id: number): Promise<Validation[]>{
        try{
            const validation = await this.ValidationRepostiory.findBy({id});
            return validation;
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:47 ~ ValidationService ~ oneById ~ error:", error);
            throw new Error(error)          
        }
    }

    //Récupérer toutes les demandes envoyées par un user
    async allByUserId(userId: number): Promise<Validation[]>{
        try{
            const validations = await this.ValidationRepostiory.find({
                where: {user_id: userId}
            });
            return validations;
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:61 ~ ValidationService ~ allByUserId ~ error:", error);
            throw new Error(error)    
        }
    }

    //Récupérer toutes les demandes reçues 
    async allByContactId(contactId: number): Promise<Validation[]>{
        try{
            const validations = await this.ValidationRepostiory.find({
                where: {contact_id: contactId}
            });
            return validations;
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:75 ~ ValidationService ~ allByContactId ~ error:", error);
            throw new Error(error)
        }
    }

    //Éliminer une demande de mise en contact
    async remove(validation: any){
        try{
            this.ValidationRepostiory.delete(validation);
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:86 ~ ValidationService ~ remove ~ error:", error);
            throw new Error(error)          
        }
    }

    //MaJ d'une validation (répondre à celle-ci)
    async update(id: number, status: number): Promise<Validation[] | {success: string; message: string}>{
        try{
            await this.ValidationRepostiory.update(id, {validation: status});
            const validation = await this.oneById(id);
            return validation;           
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:98 ~ ValidationService ~ update ~ error:", error);
            throw new Error(error)
        }
    }
}