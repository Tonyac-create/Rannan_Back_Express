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

    //Récupérer tous les contacts d'un user
    async allByUserId(userId: number): Promise<Contact[]>{
        const contacts = await this.ContactRepository.find({
            // where: {user1: {id: userId}} //user2 aussi
            where: [
                {user1: { id: userId}}, //ou
                {user2: { id: userId}}
            ],
            relations: {
                user1: true,
                user2: true,
            }
        });
        return contacts;
    }

    //Récupérer un contact spécifique de l'user (à partir de l'id de l'autre user)
    async oneByUser(userId: number): Promise<Contact[]>{
        const contact = await this.ContactRepository.find({
            where: {user2: {id: userId}}
        });
        return contact;
    }

    //Récupérer un contact spécifique entre 2 users
    async oneByUsers(user1Id: number, user2Id: number): Promise<Contact[]>{
        const contact = await this.ContactRepository.find({
            where:{
                user1: { id: user1Id},
                user2: { id: user2Id}
            }
        });
        return contact;
    }

    //Récupérer un contact par l'id du contact
    async oneByRelation(id: number): Promise<Contact[]>{
        const contact = await this.ContactRepository.findBy({id});
        return contact;
    }
        
    //éliminer un utilisateur de la liste de contacts
    async remove(id: number): Promise<string>{
        const contactToRemove = await this.ContactRepository.findOneBy({id})
        if(!contactToRemove){
            throw new Error("Contact not found");
        }
        await this.ContactRepository.remove(contactToRemove);
        return "Contact has been removed";
    }
}
