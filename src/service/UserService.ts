import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserCreateInterface } from "../interface/UserCreateInterface"
const bcrypt = require('bcrypt')

export class UserService {

    private userRepository = AppDataSource.getRepository(User)

// Trouve et renvoi tout les users
    async all() {
        try {
            return this.userRepository.find()
        }
        catch (error) {
            return error
        }
    }

// Trouve un user par une valeur de champs (value of field) & inclus en retour la liste des groupes du user ou non (populate)
    async findOne(field: string, value: number | string, populate: boolean)
    : Promise<User> {
        try {
            if (populate === true) {
                const user = await this.userRepository.findOne({
                    where: { [field]: value },
                    relations: ['groups']
                })
                return user
            } else {
                const user = await this.userRepository.findOne({
                    where: { [field]: value }
                })
                return user
            }
        } catch (error) {
            return error
        }
    }

// Créer un nouvel user
    async saveUser(body: UserCreateInterface) {
        try {
            return this.userRepository.save(body)
        }
        catch (error) {
            return error
        }
    }

// Update un user
    async update(id: number, body: any) {
        try {
            await this.userRepository.update(id, body)
            const updatedUser =  await this.userRepository.findOne({where: {id: id}})
            const {nickname, avatar_id} = updatedUser
            return {nickname, avatar_id}
        }
        catch (error) {
            return error
        }
    }

// Update le mot de passe d'un user
    async updatePassword(id: number, body: any) {
        try {
            const password = await bcrypt.hash(body, 10)
            await this.userRepository.update(id, {password: password})
            const user = await this.userRepository.findOne({where: {id: id}})
            return user
        }
        catch (error) {
            return error
        }
    }

// Supprime un user par sont id
    async remove(id: number) {
        try {
            return await this.userRepository.delete(id)
        }
        catch (error) {
            return error
        }
    }

// Trouve un user depuis un input
    async searchOne(input: string): Promise< User[] | null > {
        try {
            const users = []
            const getUsers = await this.userRepository.find()
            getUsers.map((user: User) => {
                const {nickname, id} = user
                return users.push({id: id, nickname: nickname.toLowerCase()})
            })
            const search = input.toLowerCase()
            return users.filter((user: User) => user.nickname.includes(search))
        }
        catch (error) {
            return error
        }
    }
}