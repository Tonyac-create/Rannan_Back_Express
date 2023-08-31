import { AppDataSource } from "../data-source"
import { Data } from "../entity/Data"

export class DataService {

    private dataRepository = AppDataSource.getRepository(Data)

    // Récupération de toutes les datas crées
    async all() {
        try {
            return await this.dataRepository.find();
        }
        catch (error) {
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }

    // Récupération d'une data par son id
    async getOne(id: number) {
        try {
            const data = await this.dataRepository.findOne(
                { where: { id: id } }
            )
            if (data) return data
            return {
                success: 'ko',
                message: 'user not found'
            }
        }
        catch (error) {
            console.log("🚀 ~ file: UserService.ts:15 ~ UserService ~ all ~ error:", error)
        }
    }
    // IMPORTANT A voir problème de type sur mon DataInterface ou data.ts
    // (body: DataCreateInterface) 
    async create(body: any) {
        try {
            const newData = this.dataRepository.create(body)
            return await this.dataRepository.save(newData)
        }
        catch (error) {
            console.log(error);
        }
    }

    // Suppression d'une data
    async remove(id: number) {
        try {
            const deleteData = await this.dataRepository.findOne(
                { where: { id: id } }
            )
            if (deleteData) {
                return await this.dataRepository.remove(deleteData);
            } else {
                return {
                    success: 'ko',
                    message: 'data not found'
                }
            }

        }
        catch (error) {
            console.log(error);

        }
    }

    // Mise à jour d'une data
    async update(id: number) {
        try {
            const updateData = await this.dataRepository.findOne(
                {
                    where: {
                        id: id,
                    }
                }
            )

            if (updateData) return this.dataRepository.merge(updateData)


        }
        catch (error) {
            console.log("error:", error)
        }
        
    }

}
