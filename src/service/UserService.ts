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
            throw error.message
        }
    }

// Trouve un user par une valeur de champs (value of field)
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
            return await this.userRepository.findOne({where: {id: id}})
        }
        catch (error) {
            throw error.message
        }
    }

// Update un user
    async updatePassword(id: number, body: any) {
        try {
            const password = await bcrypt.hash(body, 10)
            await this.userRepository.update(id, {password: password})
            await this.userRepository.findOne({where: {id: id}})
            return body
        }
        catch (error) {
            throw error.message
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
            throw error.message
        }
    }
    }