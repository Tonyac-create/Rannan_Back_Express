import { AppDataSource } from "../data-source";
import { Validation } from "../entity/Validation";

export class ValidationService{
    private ValidationRepostiory = AppDataSource.getRepository(Validation)

    //Création d'une validation entre 2 users (demande pour ajouter l'user à nos contact)
    async create(userId: number, contactId: number) : Promise<Validation>{
        try{
            const newValidation = this.ValidationRepostiory.create({
                user_id: userId,
                contact_id: contactId
            });
            return await this.ValidationRepostiory.save(newValidation);
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:19 ~ ValidationService ~ create ~ error:", error);
            throw new Error(error)
        }
    }

    //Récupérer une validation spécifique entre 2 users
    async oneByUsers(userId: number, contactId: number): Promise<Validation>{
        try{
            return this.ValidationRepostiory.findOne(
                {where:{
                    user_id: userId,
                    contact_id: contactId
                }}
                /* {where:{
                    user_id: contactId,
                    contact_id: userId
                }} */
            );
        }
        catch(error){
            console.log("🚀 ~ file: ValidationService.ts:35 ~ ValidationService ~ oneByUsers ~ error:", error);
            throw new Error(error)
        }
    }

    //Récupérer une validation spécifique entre 2 users par id de la validation
    async oneById(id: number): Promise<Validation>{
        try{
            const validation = await this.ValidationRepostiory.findOneBy({id});
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

    //Formater l'objet user dans validation
    userFormated(user: any){
        const targetUser = user;
        const FormatedUser = {user_id: targetUser.id, nickname: targetUser.nickname};
        return FormatedUser;
    }

    contactFormated(user: any){
        const targetContact = user;
        const contact = {contact_id: targetContact.id, nickname: targetContact.nickname};
        return contact;
    }

    //Éliminer une demande de mise en contact
    async remove(id: number): Promise<string> {
        try {
            const validation = await this.ValidationRepostiory.findOneBy({ id: id })
            if (!validation) {
                throw new Error("validation not found")
            }
            await this.ValidationRepostiory.remove(validation)
            return `validation ${validation.id} was deleted`
        } catch (error) {
            throw error.message
        }
    }
}