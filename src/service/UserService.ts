import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserCreateInterface } from "../interface/UserInterface"

export class UserService {

    private userRepository = AppDataSource.getRepository(User)

    async all() {
        try {
            // Find and Return all users
            return this.userRepository.find()
        }
        catch (error) {
            console.log("🐼UserService ~ all ~ error:", error)
        }
    }

    async one(id: number) {
        try {
            // Search a User by ID
            const one = await this.userRepository.findOne({
                where: {
                    id: id
                },
            })
            return one
        } catch (error) {
            console.log("🐼UserService ~ one ~ error:", error)
        }
    }

    async oneByMail(body: UserCreateInterface) {
        const user = await this.userRepository.findOne({
            where: {
                email: body.email
            },
        })
        return user
    }

    async create(body: UserCreateInterface) {
        try {
            // New User Create
            const newUser = this.userRepository.create(body)
            // New User Save on db
            await this.userRepository.save(newUser)
            return newUser
        }
        catch (error) {
            console.log("🐼UserService ~ create ~ error:", error)
        }
    }

    async remove(id: number) {
        try {
            // Delete user by ID
            await this.userRepository.delete(id)
        }
        catch (error) {
            console.log("🐼UserService ~ remove ~ error:", error)
        }
    }

    async update(id: number) {
        try {
            const updateUser = await this.userRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            );
            if (updateUser) return this.userRepository.merge(updateUser);

            return {
                success: 'ko',
                message: 'user not found'
            }
        }
        catch (error) {
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
        
    }

}
