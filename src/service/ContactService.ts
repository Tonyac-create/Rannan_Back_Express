import { AppDataSource } from "../data-source";
import { Contact } from "../entity/Contact";
import { UserService } from "./UserService";

export class ContactService{

    private ContactRepository = AppDataSource.getRepository(Contact);
    private userService = new UserService();

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
            throw new Error(error)
        }
    }

    //récupérer tous les contacts d'un user d'un coup
    async allByUserId(id: any): Promise<Contact[]>{
        try{
            const allUserOne = await this.ContactRepository.find({where: {user1_id: id}})
            const allUserTwo = await this.ContactRepository.find({where: {user2_id: id}})
            return [...allUserOne, ...allUserTwo]
        }
        catch (error){
            throw new Error(error)
        }
    }

    //Récupérer tous les contacts d'un user par son role dans celuici (user1 ou user2)
    async allByUserRole(role: string, id: number): Promise<Contact[]>{
        try{
            const allUserRole = await this.ContactRepository.find({where: {[role]: id}})
            return allUserRole
        }
        catch(error){
            throw new Error(error)
        }
    }
    
    //Formater l'objet user dans contact
     returnContactList(list: any, currentUserId: string, otherUserId: string, otherUserRole: string){   //currentUserId && otherUserId = "user1_id" ou "user2_id" 
        const returnList = Promise.all(list.map(async(element) => {
            const targetUser = await this.userService.findOne("id", element[otherUserId], false);
            const otherUser = {[otherUserId]: targetUser.id, nickname: targetUser.nickname}
            const contact = {
                id: element.id,
                // [currentUserId]: element[currentUserId], //à voir
                [otherUserRole] : otherUser
            }    
            // returnList.push(contact);
            return contact      
        }))
        return returnList;
    }

    //récupérer un contact par id contact
    async oneById(id: number): Promise<Contact> {
        try{
            const contact = await this.ContactRepository.findOneBy({id});
            return contact;  
        }
        catch(error){
            throw new Error(error)
        }  
    }

    //Récupérer un contact spécifique entre 2 users
    async oneByUsers(user1Id: number, user2Id: number): Promise<Contact> { // à verifier que user1 ne peut pas être user2  
        try{
            return this.ContactRepository.findOne({
                where:[{
                    user1_id :user1Id,
                    user2_id: user2Id
                },
                {
                    user1_id :user2Id,
                    user2_id: user1Id
                }]
            });
        }
        catch(error){
            throw new Error(error)
        }
    }

    //Eliminer un contact
    async remove(id: number): Promise<string> {
        try {
            const contact = await this.ContactRepository.findOneBy({ id: id })
            if (!contact) {
                throw new Error("contact not found")
            }
            await this.ContactRepository.remove(contact)
            return `contact ${contact.id} was deleted`
        } catch (error) {
            throw error.message
        }
    }
}
