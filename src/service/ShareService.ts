import { AppDataSource } from "../data-source";
import { Data } from "../entity/Data";
import { Share } from "../entity/Share";
import { DataService } from "./DataService";
import { UserService } from "./UserService";


export class ShareService {

    private ShareRepository = AppDataSource.getRepository(Share)

    // Récupération de toutes les shares
    async allShares() {
        try {
            return this.ShareRepository.find()
        } catch (error) {
            throw error.message
        }
    }

    async allByDatas(field: string, value: string | number) {
        try {
            return this.ShareRepository.find({
                where: { [field]: value },
                relations: ['datas']
            });
        }
        catch (error) {
            return error
            // throw new Error(error)
        }
    }
    

    // Récupération d'une share par son id
    async getShareById(id: number) {
        try {
            const share = this.ShareRepository.find({ where: { id } })
            return share
        }
        catch (error) {
            throw new Error(error)

        }
    }

    //Création d'un share
    async create(target: string, target_id: number, owner_id: number): Promise<Share | { success: string; message: string }> {
        try {
            const newShare = this.ShareRepository.create({
                target: target,
                target_id: target_id,
                owner_id: owner_id
            })
            return await this.ShareRepository.save(newShare);
        }
        catch (error) {
                throw new Error(error)
        }
    }

            /* TEST */
    //Lier la data et l'share
    async addDataToShare(share_id: number, data_id: number) {
        // Ajouter 'data' à la liste 'datas' de 'share'
        
    
        // Enregistrer 'share' dans la base de données
        // return await this.ShareRepository.save(share);
    }

    //Supprimer une share
    async remove(id: number) {
        try {
            // Delete share by ID
            await this.ShareRepository.delete(id)
        }
        catch (error) {
            return {
                success: 'ko',
                message: error.message
            };
        }
    }
}