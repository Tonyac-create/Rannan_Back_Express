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
            // Search a User by ID
            return await this.userRepository.findOne({ where: { id } })
        } catch (error) {
        console.log("🐼 ~ file: UserService.ts:29 ~ oneById ~ error:", error)
        }
    }

    async oneByMail(body: UserCreateInterface) {
        try {
            // Search a User by email
            const user = await this.userRepository.findOne({
                where: {
                    email: body.email
                },
            })
            return user
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
            console.log("🐼 ~ file: UserService.ts:79 ~ update ~ error:", error)
        }
        
    }

}
