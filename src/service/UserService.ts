import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserCreateInterface } from "../interface/UserInterface"

export class UserService {

    private userRepository = AppDataSource.getRepository(User)

// Find and Return all users
    async all() {
        try {
            return this.userRepository.find()
        }
        catch (error) {
            throw error
        }
    }

// Find a User by field and value
    async findOne(field: string, value: number | string):Promise<User> {
        try {
            return this.userRepository.findOne({
                where: { [field]: value },
                relations: ['groups','datas'] // !TODO: rendre optionnel le populate
            })
        } catch (error) {
            throw error
        }
    }

// Create New User
    async create(body: UserCreateInterface) {
        try {
            return this.userRepository.save(body)
        }
        catch (error) {
            throw error
        }
    }

// Update user
    async update(id: number, body: any) {
        try {
            await this.userRepository.update(id, body)
        }
        catch (error) {
            throw error
        }
    }

// Delete user by ID
    async remove(id: number) {
        try {
            await this.userRepository.delete(id)
        }
        catch (error) {
            throw error
        }
    }
}
