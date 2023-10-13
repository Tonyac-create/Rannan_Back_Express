import { AppDataSource } from "../data-source";
import { Share } from "../entity/Share";

export class ShareService {

    private ShareRepository = AppDataSource.getRepository(Share)

    // Récupération de toutes les shares d'une target (BODY : target = "group" ou "user" / id = target_id)


    // Récupération d'une share par son id
    async getShareById(id: number) {
        try {
            const share = this.ShareRepository.find({ where: { id } })
            return share
        }
        catch (error) {
            return {
                success: 'ko',
                message: error.message
            };
        }
    }

    //Création d'une autorisation
    async create(target: string, target_id: number): Promise<Share | { success: string; message: string }> {
        try {
            const newShare = this.ShareRepository.create({
                target: target,
                target_id: target_id
            });
            return await this.ShareRepository.save(newShare);
        }
        catch (error) {
            return {
                success: 'ko',
                message: error.message
            };
        }
    }

    //Lier la data et l'share
    

    //Supprimer une share
    async remove(id: number) {
        try {
            // Delete user by ID
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