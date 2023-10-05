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
        console.log("🐼 ~ file: UserService.ts:15 ~ all ~ error:", error)
        }
    }

    async oneById(id: number) {
        try {
            // Find a User by ID
            return await this.userRepository.findOne({ where: { id } })
        } catch (error) {
        console.log("🐼 ~ file: UserService.ts:24 ~ oneById ~ error:", error)
        }
    }

    async oneByMail(body: UserCreateInterface) {
        try {
            // Search a User by email
            return await this.userRepository.findOne({ where: { email: body.email } })
        } catch (error) {
        console.log("🐼 ~ file: UserService.ts:43 ~ oneByMail ~ error:", error)
        }
    }

    async create(body: UserCreateInterface) {
        try {
            // Create New User
            const newUser = this.userRepository.create(body)
            // Save New User on db
            await this.userRepository.save(newUser)
            return newUser
        }
        catch (error) {
        console.log("🐼 ~ file: UserService.ts:56 ~ create ~ error:", error)
        }
    }
    
    async remove(id: number) {
        try {
            // Delete user by ID
            await this.userRepository.delete(id)
        }
        catch (error) {
        console.log("🐼 ~ file: UserService.ts:66 ~ remove ~ error:", error)
        }
    }

    
    async update(id: number, body: any) {
        try {
            const userToUpdate = await this.userRepository.findOne(
                {where: { id: id }}
            );
            if (!userToUpdate) {
                return {
                    success: 'ko',
                    message: 'user not found'
                }
            };
            
            userToUpdate.nickname = body.nickname
            userToUpdate.email = body.email
            userToUpdate.password = body.password
            userToUpdate.avatar_id = body.avatar_id

            const updatedUser = await this.userRepository.save(userToUpdate)
            return updatedUser
        }
        catch (error) {
            console.log("🐼 ~ file: UserService.ts:79 ~ update ~ error:", error)
        }
        
    }

}
