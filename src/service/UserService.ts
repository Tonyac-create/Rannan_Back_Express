import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserCreateInterface } from '../interface/UserInterface';


export class UserService {

    private userRepository = AppDataSource.getRepository(User)

    async all() {
        try {
            return await this.userRepository.find();
        }
        catch (error) {
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }

    async one(id: number) {
        try {
            const user = await this.userRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            );
            if (user) return user;

            return {
                success: 'ko',
                message: 'user not found'
            }
        }
        catch (error) {
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }

    async create(body: UserCreateInterface) {
        try {
            const newUser = this.userRepository.create(body);
            return await this.userRepository.save(newUser);
        }
        catch (error) {
            return {
                success: 'ko',
                message: error.message
            }
        }
    }

    async remove(id: number) {
        try {
            const deleteUser = await this.userRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            );

            if (deleteUser) {

                return await this.userRepository.remove(deleteUser);

            } else {
                return {
                    success: 'ko',
                    message: 'user not found'
                }
            }
        }
        catch (error) {
            console.log(error)
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
