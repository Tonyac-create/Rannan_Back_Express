import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserCreateInterface } from "../interface/UserCreateInterface"
const bcrypt = require('bcrypt')

export class UserService {

    private userRepository = AppDataSource.getRepository(User)

// Trouve et renvoi tout les users
    async all() {
        return this.userRepository.find()
    }

// Trouve un user par une valeur de champs (value of field) & inclus en retour la liste des groupes du user ou non (populate)
    async findOne(field: string, value: number | string, populate: boolean)
    : Promise<User> {
        if (populate === true) {
            return await this.userRepository.findOne({
                where: { [field]: value },
                relations: ['groups']
            })
        } else {
            return await this.userRepository.findOne({
                where: { [field]: value }
            })
        }
    }

// Créer un nouvel user
    async saveUser(body: UserCreateInterface) {
        return this.userRepository.save(body)
    }

// Update un user
    async update(id: number, body: any) {
        await this.userRepository.update(id, body)
        const user = await this.userRepository.findOne({
            where: { id: id }
        })
        await this.userRepository.save(user)
    }

// Update le mot de passe d'un user
    async updatePassword(id: number, body: any) {
        const password = await bcrypt.hash(body, 10)
        await this.userRepository.update(id, {password: password})
    }

// Supprime un user par sont id
    async remove(user: User) {
        return await this.userRepository.remove(user)
    }

// Trouve un user depuis un input
    async searchOne(input: string): Promise< User[] | null > {
        const users = []
        const search = input.toLowerCase()
        const getUsers = await this.userRepository.find()
        getUsers.map((user: User) => {
            const lowNickname = user.nickname.toLocaleLowerCase()
            if (lowNickname.includes(search)) {
                const {nickname, id} = user
                return users.push({id: id, nickname: nickname})
            }
        })
        return users
    }
}