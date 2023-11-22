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
            console.log("🚀 ~ file: ContactService.ts:20 ~ ContactService ~ create ~ error:", error);
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
            console.log("🚀 ~ file: ContactService.ts:33 ~ ContactService ~ allByUserId ~ error:", error);
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
        let returnList=[];
         list.map(async(element) => {
            const targetUser = await this.userService.findOne("id", element[otherUserId], false);
            const otherUser = {[otherUserId]: targetUser.id, nickname: targetUser.nickname}
            const contact = {
                id: element.id,
                [currentUserId]: element[currentUserId],
                [otherUserRole] : otherUser
            }    
            returnList.push(contact);
            console.log("🚀 ~ file: ContactService.ts:63 ~ ContactService ~ returnContactList ~ returnList:", returnList)

        })
        console.log("🚀 ~ file: ContactService.ts:66 ~ ContactService ~ returnContactList ~ returnList:", returnList);
        return returnList;
    }

    user1Formated(user: any){
        const targetUser1 = user;
        const user1 = {user1_id: targetUser1.id, nickname: targetUser1.nickname};
        return user1;
    }

    user2Formated(user: any){
        const targetUser2 = user;
        const user2 = {user2_id: targetUser2.id, nickname: targetUser2.nickname};
        return user2;
    }

    //récupérer un contact par id contact
    async oneById(id: number): Promise<Contact> {
        try{
            const contact = await this.ContactRepository.findOneBy({id});
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
                /* where: {
                    user1_id :user2Id,
                    user2_id: user1Id
                } */
            });
        }
        catch(error){
            console.log("🚀 ~ file: ContactService.ts:81 ~ ContactService ~ oneByUsers ~ error:", error)
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
