import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserCreateInterface } from "../interface/UserCreateInterface"

export class UserService {

    private userRepository = AppDataSource.getRepository(User)

// Trouve et renvoi tout les users
    async all() {
        try {
            return this.userRepository.find()
        }
        catch (error) {
            throw error.message
        }
    }

// Trouve un user par une valeur de champs (value of field)
    async findOne(field: string, value: number | string, populate: boolean)
    : Promise<User> {
        try {
            if (populate === true) {
                return this.userRepository.findOne({
                    where: { [field]: value },
                    relations: ['groups']
                })
            } else {
                return this.userRepository.findOne({
                    where: { [field]: value }
                })
            }
        } catch (error) {
            throw error.message
        }
    }

// Créer un nouveau user
    async saveUser(body: UserCreateInterface) {
        try {
            return this.userRepository.save(body)
        }
        catch (error) {
            throw error.message
        }
    }

// Update un user
    async update(id: number, body: any) {
        try {
            await this.userRepository.update(id, body)
            const updated = await this.userRepository.findOne({where: {id: id}})
            return updated
        }
        catch (error) {
            console.log("🐼 ~ file: UserService.ts:54 ~ update ~ error:", error)
        }
    }

// Supprime un user par sont id
    async remove(id: number) {
        try {
            return await this.userRepository.delete(id)
        }
        catch (error) {
            throw error.message
        }
    }
}
