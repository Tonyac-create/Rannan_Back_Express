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
        console.log("🐼 ~ file: UserService.ts:15 ~ all ~ error:", error)
        }
    }

// Find a User by field and value
    async findOne(field: string, value: number | string) {
        try {
            const user = await this.userRepository.findOne({
                where: { [field]: value },
                relations: ['groups','datas']
            })
            return user
        } catch (error) {
        console.log("🐼 ~ file: UserService.ts:24 ~ oneById ~ error:", error)
        }
    }

// Create New User
    async create(body: UserCreateInterface) {
        try {
            const newUser = this.userRepository.create(body)
            await this.userRepository.save(newUser)
            return newUser
        }
        catch (error) {
        console.log("🐼 ~ file: UserService.ts:56 ~ create ~ error:", error)
        }
    }

// Update user
    async update(id: number, body: any) {
        try {
            await this.userRepository.update(id, {
                nickname: body.nickname,
                email: body.email,
                password: body.password,
                avatar_id: body.avatar_id
            })
            return "User as updated"
        }
        catch (error) {
            console.log("🐼 ~ file: UserService.ts:79 ~ update ~ error:", error)
        }
    }

// Delete user by ID
    async remove(id: number) {
        try {
            await this.userRepository.delete(id)
        }
        catch (error) {
        console.log("🐼 ~ file: UserService.ts:66 ~ remove ~ error:", error)
        }
    }

// Save User for GroupController
    async save(body: UserCreateInterface) {
        try {
            const savedUser = await this.userRepository.save(body)
            return savedUser
        }
        catch (error) {
        console.log("🐼 ~ file: UserService.ts:56 ~ create ~ error:", error)
        }
    }


}
