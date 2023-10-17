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
    async create(target: string, target_id: number, owner_id: number): Promise<Share | { success: string; message: string }> {
        try {
            const newShare = this.ShareRepository.create({
                target: target,
                target_id: target_id,
                owner_id: owner_id
            });
            console.log("🚀 ~ file: ShareService.ts:32 ~ ShareService ~ create ~ newShare:", newShare)
            return await this.ShareRepository.save(newShare);
        }
        catch (error) {
                throw new Error(error)
        }
    }

    //Lier la data et l'share
    // async linkDataToShare(data_id: number, share_id: number): Promise<Share> {
    //     try {
    //         const dataShare = this.ShareRepository.create({
    //             data_id: data_id,
    //             share_id: share_id
    //         })
    //         return await this.ShareRepository.save(dataShare)
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }

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