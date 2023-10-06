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
            throw error.message
        }
    }

// Find a User by field and value
    async findOne(field: string, value: number | string, populate: boolean) {
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

// Create New User
    async create(body: UserCreateInterface) {
        try {
            const newUser = await this.userRepository.save(body)
            return newUser
        }
        catch (error) {
            throw error.message
        }
    }

// Update user
    async update(id: number, body: any) {
        try {
            await this.userRepository.update(id, body)
        }
        catch (error) {
            throw error.message
        }
    }

// Delete user by ID
    async remove(id: number) {
        try {
            await this.userRepository.delete(id)
        }
        catch (error) {
            throw error.message
        }
    }
}
