import { log } from "util";
import { AppDataSource } from "../data-source"
import { Data } from "../entity/Data"
import { User } from "../entity/User"
import { DataCreateInterface } from '../interface/DataInterface';

export class DataService {

    private dataRepository = AppDataSource.getRepository(Data)
    private userRepository = AppDataSource.getRepository(User)


    // Récupération de toutes les datas crées
    async all() {
        try {
            return await this.dataRepository.find({
                relations: ["creator"]
            });
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

    // Récupération de toute les datasd'un user_id
    async getDatasInUser(userId: number) {
        try {
            const user = await this.userRepository.find({
                where: { id: userId },
                relations: ["datas"]
            })

            if (!user) return 'User not found'

            return user

        }
        catch (error) {
            console.log(error);

        }
    }

    async addDataOneUser(body: DataCreateInterface, userId: number): Promise<Data | User> {
        try {
            const user = await this.userRepository.findOne({
                where: {id: userId}
            })
            
            const newData = this.dataRepository.create(body)
            newData.user = user

            console.log("User récupérer dans service", user);
            console.log("new Data service", newData);            
            
            return await this.dataRepository.save(newData)
            // const user_id = await this.userRepository.findOne({
            //     where: {id: userId}
            // })

            // const newData = this.dataRepository.create(body)

            // console.log("User récupérer dans service", user_id);
            // console.log("new Data service", newData);            
            
            // return await this.dataRepository.save(newData)
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
