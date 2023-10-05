import { AppDataSource } from "../data-source";
import { Contact } from "../entity/Contact";

export class ContactService{

    private ContactRepository = AppDataSource.getRepository(Contact)

    //Création d'un lien de contact entre 2 users
    async create(user1Id: number, user2Id: number) : Promise<Contact | {success: string; message: string}> {
        try{
            const newContact = this.ContactRepository.create({
                user1 :{id: user1Id},
                user2: {id: user2Id}
            });
            return await this.ContactRepository.save(newContact);
        }
        catch (error){
            return{
                success:'ko',
                message: error.message
            };
        }
    }

    //récupérer tous le contacts
    async all(){
        try{
            return await this.ContactRepository.find();
        }
        catch (error){
            console.log("🚀 ~ file: ContactService.ts:31 ~ ContactService ~ all ~ error:", error)    
        }
    }

    //récupérer tous les contacts d'un user
    async allByUserId(id: any){
        try{
            const allUserOne = await this.ContactRepository.find({where: {user1_id: id}})
            const allUserTwo = await this.ContactRepository.find({where: {user2_id: id}})
            return [...allUserOne, ...allUserTwo]
        }
        catch (error){
            console.log("🚀 ~ file: ContactService.ts:43 ~ ContactService ~ allByUserId ~ error:", error) 
        }
    }

    //récupérer un contact par id contact
    async one(id: number): Promise<Contact[]> {
        const contact = await this.ContactRepository.findBy({id});
        return contact;    
    }

    //Récupérer un contact spécifique entre 2 users
    async oneByUsers(user1Id: number, user2Id: number): Promise<Contact[]> {
        try{
            const contact = await this.ContactRepository.find({
                where:{
                    user1: { id: user1Id},
                    user2: { id: user2Id}
                }
            });
            return contact;
        }
        catch(error){
            console.log("🚀 ~ file: ContactService.ts:81 ~ ContactService ~ oneByUsers ~ error:", error)
        }
    }

    //Eliminer un contact
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
