import { request } from "http";
import { publishMessage, requestMessage } from "../../nats-config";
import { AppDataSource } from "../data-source"
import { Data } from "../entity/Data"

export class DataService {

    private dataRepository = AppDataSource.getRepository(Data)

    // Récupération de toutes les datas crées
    async allByShare(field: string, value: number) {
        try {
            return this.dataRepository.findOne({
                where: { [field]: value },
                relations: ['authorizations']
            });
        }
        catch (error) {
            throw new Error(error)
        }
    }

    // Récupération d'une data par son id
    async getOneById(id: string) {
        try {
            const res = await this.dataRepository.find({ where: { id } })
            return res
        }
        catch (error) {
            throw new Error(error)
        }
    }

    // Récupération de toute les datas d'un user_id
    // async getDatasInUser(user_id: number) {
    //     try {
    //         const datas = await this.dataRepository.find({ where: { user_id } })
    //         console.log("🚀 ~ file: DataService.ts:43 ~ DataService ~ getDatasInUser ~ datas:", datas)
    //         return datas
    //     }
    //     catch (error) {
    //         throw new Error(error)
    //     }
    // }

    // Création d'une data pour un utilisateur
    // async createDataOneUser(type: any, name: string, value: string, user_id: number) {
    //     try {
    //         console.log("hello");
            
    //         const newData = new Data()
    //         newData.type = type
    //         newData.name = name
    //         newData.value = value
    //         newData.user_id = user_id

    //         const savedData = await this.dataRepository.save(newData);

    //         return savedData
    //     }
    //     catch (error) {
    //         throw new Error(error)
    //     }
    // }

    // Suppression d'une data
    // async remove(id: string) {
    //     try {
    //         return await this.dataRepository.delete(id)
    //     }
    //     catch (error) {
    //         throw new Error(error)
    //     }
    // }

    // Mise à jour d'une data
    // async update(id: string, body: any) {
    //     try {
    //         const updateData = await this.dataRepository.findOne(
    //             {
    //                 where: {
    //                     id: id,
    //                 }
    //             }
    //         )
    //         if (!updateData) { return 'data not found' }

    //         updateData.type = body.type
    //         updateData.name = body.name
    //         updateData.value = body.value

    //         return this.dataRepository.save(updateData)
    //     }
    //     catch (error) {
    //         throw new Error(error)
    //     }
    // }

}
