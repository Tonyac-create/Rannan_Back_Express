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
            const user = await this.userRepository.findOne({
                where: {
                    id: id
                },
            })
            // If ID is found
            if (user) return user
            // If ID is not found
            return {
                success: "ko",
                message: "user not found"
            }
        } catch (error) {
            console.log("🐼UserService ~ one ~ error:", error)
        }
    }

    async create(body: UserCreateInterface) {
        try {
            // Check if email is already used
            const user = await this.userRepository.findOne({
                where: {
                    email: body.email
                },
            })
            // IF email not exist
            if (!user) {
                // New User Create
                const newUser = this.userRepository.create(body)
                // New User Save on db
                return await this.userRepository.save(newUser)
            }
            // IF email already exist
            return {
                success: `ko`,
                message: `email '${body.email}' already use`
            }
        }
        catch (error) {
            console.log("🐼UserService ~ create ~ error:", error)
        }
    }

    async remove(id: number) {
        try {
            // Search a User by ID
            const user = await this.userRepository.findOne({
                where: {
                    id: id
                },
            })
            // IF ID is found
            if (user) {
                // save user name for return message
                const message = {
                    success: "ok",
                    message: `user ${user.nickname} deleted`
                }
                // Delete user by ID
                await this.userRepository.delete(id)
                // return message with user's nickname
                return message
            }
            // IF ID is not found
            return {
                success: "ko",
                message: "user not found"
            }
            
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
