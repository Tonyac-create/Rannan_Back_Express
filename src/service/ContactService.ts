import { AppDataSource } from "../data-source";
import { Contact } from "../entity/Contact";
import { ContactCreateInterface } from "../interface/ContactInterface";

export class ContactService{
    private ContactRepository = AppDataSource.getRepository(Contact)

    async create(body: any){//A modifier typage utiliser interface ?
        console.log("ici le body de la requete "+body)
        try{
            const newContact = this.ContactRepository.create(body);
            
            return body;
        }
        catch (error){
            return{
                success:'ko',
                message: error.message
            }
        }
    }

    async all(){
        try{
            return await this.ContactRepository.find();
        }
        catch (error){
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }

    async one(id: number){
        try{
            const contact = await this.ContactRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            );
            if (contact) return contact;

            return {
                success: 'ko',
                message: 'user not found'
            }
        }
        catch (error) {
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }

    async remove(id: number){
        try{
            const contact = await this.ContactRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            );
            if (contact){
                this.ContactRepository.delete(contact)
            }
        }
        catch(error) {
            return {
                success: 'ko',
                message: error.message
            }
        }
    }
}
