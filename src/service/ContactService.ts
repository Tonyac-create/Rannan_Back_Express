import { AppDataSource } from "../data-source";
import { Contact } from "../entity/Contact";

export class ContactService{

    private ContactRepository = AppDataSource.getRepository(Contact)

    //Création d'un lien de contact entre 2 users
    async create(user1Id: number, user2Id: number) : Promise<Contact> {
        try{
            const newContact = this.ContactRepository.create({
                user1_id :user1Id,
                user2_id: user2Id
            });

            return this.ContactRepository.save(newContact);

        }
        catch (error){
            console.log("🚀 ~ file: ContactService.ts:20 ~ ContactService ~ create ~ error:", error);
            throw new Error(error)
        }
    }

    //récupérer tous le contacts
    async all(){
        try{
            return await this.ContactRepository.find();
        }
        catch (error){
            console.log("🚀 ~ file: ContactService.ts:31 ~ ContactService ~ all ~ error:", error);
            throw new Error(error); 
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
            console.log("🚀 ~ file: ContactService.ts:43 ~ ContactService ~ allByUserId ~ error:", error);
            throw new Error(error)
        }
    }

    //récupérer un contact par id contact
    async one(id: number): Promise<Contact[]> {
        try{
            const contact = await this.ContactRepository.findBy({id});
            return contact;  
        }
        catch(error){
            console.log("🚀 ~ file: ContactService.ts:53 ~ ContactService ~ one ~ error:", error);
            throw new Error(error)
        }  
    }

    //Récupérer un contact spécifique entre 2 users
    async oneByUsers(user1Id: number, user2Id: number): Promise<Contact> { // à verifier que user1 ne peut pas être user2 
        try{
            return this.ContactRepository.findOne({
                where:{
                    user1_id :user1Id,
                    user2_id: user2Id
                }
                //,orWhere { user1: { id: user1Id}, user2: { id: user2Id} }
            });
        }
        catch(error){
            console.log("🚀 ~ file: ContactService.ts:81 ~ ContactService ~ oneByUsers ~ error:", error)
            throw new Error(error)
        }
    }

    //Eliminer un contact
    async remove(contact: any){
        try{
            this.ContactRepository.delete(contact);
        }
        catch(error) {
            console.log("🚀 ~ file: ContactService.ts:75 ~ ContactService ~ remove ~ error:", error);
            throw new Error(error)
        }
    }
}
