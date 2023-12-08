import { AppDataSource } from "../data-source";
import { Validation } from "../entity/Validation";
import { UserService } from "./UserService";

export class ValidationService{
    private ValidationRepostiory = AppDataSource.getRepository(Validation);
    private userService = new UserService();

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
            throw new Error(error)
        }
    }

    //Récupérer une validation spécifique entre 2 users
    async oneByUsers(userId: number, contactId: number): Promise<Validation>{
        try{
            return this.ValidationRepostiory.findOne({
                where:[{
                    user_id: userId,
                    contact_id: contactId
                },
                {
                    user_id: contactId,
                    contact_id: userId
                }]
            });
        }
        catch(error){
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
            throw new Error(error)          
        }
    }

    //Récupérer validations par le role de l'user (contact_id, user_id)
    async allByUserRole(role: string, id: number): Promise<Validation[]>{
        try{
            const validations = await this.ValidationRepostiory.find({where: {[role]: id}})
            return validations
        }
        catch(error){
            throw new Error(error)
        }
    }

    //Formater l'objet user dans validation
    returnValidationtList(list: any, currentUserId: string, otherUserId: string, otherUserRole: string){   //currentUserId && otherUserId = "user_id" ou "contact_id" 
        const returnList = Promise.all(list.map(async(element) => {
            const targetUser = await this.userService.findOne("id", element[otherUserId], false);
            const otherUser = {[otherUserId]: targetUser.id, nickname: targetUser.nickname}
            const validation = {
                id: element.id,
                // [currentUserId]: element[currentUserId], //à voir
                [otherUserRole] : otherUser
            }    
            // returnList.push(contact);
            return validation     
        }))
        return returnList;
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