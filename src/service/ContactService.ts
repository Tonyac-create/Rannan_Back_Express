import { AppDataSource } from "../data-source";
import { Contact } from "../entity/Contact";

export class ContactService{

    private ContactRepository = AppDataSource.getRepository(Contact)

    //Création d'un lien de contact entre 2 users
    async create(user1Id: number, user2Id: number) : Promise<Contact | {success: string; message: string}> {
        try{
            const newContact = this.ContactRepository.create({
                user1Id :{id: user1Id},
                user2Id: {id: user2Id}
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

    async all(){
        try{
            return await this.ContactRepository.find();
        }
        catch (error){
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }

    async allByUserId(id: any){
        try{
            const allUserOne = await this.ContactRepository.find({where: {user1Id: id}})
            const allUserTwo = await this.ContactRepository.find({where: {user2Id: id}})
            return [...allUserOne, ...allUserTwo]
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
