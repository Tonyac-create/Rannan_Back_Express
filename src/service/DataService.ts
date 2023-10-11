import { AppDataSource } from "../data-source"
import { Data } from "../entity/Data"
import { UserService } from "./UserService";

export class DataService {

    private dataRepository = AppDataSource.getRepository(Data)
    private userService = new UserService()


    // Récupération d'une data par son id
    async getOneById(id: number) {
        try {
            return await this.dataRepository.findOne({ where: { id } })
        }
        catch (error) {
            throw error.message
        }
    }

    // Récupération de toute les datas d'un user_id
    async getDatasInUser(userId: number) {
        try {
            const user = await this.userService.findOne("id", userId, true)
            if (!user) return 'User not found'
            return user
        }
        catch (error) {
            throw error.message
        }
    }

    // Création d'une data pour un utilisateur
    async createDataOneUser(id: number, type: any, name: string, value: string) {
        try {
            const user = await this.userService.findOne("id", id, false
            //     {
            //     where: {id}
            // }
            )
            console.log("🚀 ~ file: DataService.ts:58 ~ DataService ~ createDataOneUser ~ user:", user)
            if (!user) return 'User not found'
            const newData = new Data()
            newData.user = user
            newData.type = type
            newData.name = name
            newData.value = value
            
            await this.dataRepository.save(newData)
            return newData
        }
        catch (error) {
            throw error.message
        }
    }

    // Suppression d'une data
    async remove(id: number) {
        try {
            await this.dataRepository.delete(id)
        }
        catch (error) {
            throw error.message
        }
    }

    // Mise à jour d'une data
    async update(id: number, body: any) {
        try {
            const updateData = await this.dataRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            )
            if (!updateData) { return 'data not found'}
            
            updateData.type = body.type
            updateData.name = body.name
            updateData.value = body.value

            return this.dataRepository.save(updateData)
        }
        catch (error) {
            throw error.message
        }
    }

}
