import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Group } from "../entity/Group"
import { GroupService } from "../service/groupService"

export class GroupController {

    private groupRepository = AppDataSource.getRepository(Group)
    private groupService = new GroupService()

//Get all groups
//////////////////////A MODIFIER POUR RENVOYER UNIQUEMENT LE CREATOR_ID/////////////////////////
    async all(request: Request, response: Response, next: NextFunction) {

        const groups = await this.groupService.allWithCreator()
        // const groups = await this.groupRepository.find({
        //     relations: ['creator'] // Specify the name of the relation to include
        // });

        return response.json(groups);
    }

//Get group by creator id
    async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {
        const creatorId = parseInt(request.params.id);
        //user = get user from CreatorId
        //if(!user ){//je sors de la fonction}
        const groups = await this.groupRepository.find({
            where: { creator: { id: creatorId } },
            relations: ['creator'] // Optionally include creator details
        });

        if (!groups || groups.length === 0) {
            return response.status(404).json({ error: "No groups found for the specified creator" });
        }

        return response.json(groups);
    }



//Post new group
    async save(request: Request, response: Response, next: NextFunction) {
        const { name, creatorId } = request.body;

        const group = this.groupRepository.create({
            name,
            creator: { id: creatorId } // Crée une instance User avec seulement l'ID du créateur
        });

        const savedGroup = await this.groupRepository.save(group);

        return response.status(201).json(savedGroup);
    }


//Update group
    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { name, limited_at } = request.body;

        // Find the group to update
        const groupToUpdate = await this.groupRepository.findOneBy({ id })

        if (!groupToUpdate) {
            return response.status(404).json({ error: "Group not found" });
        }

        // Update fields
        groupToUpdate.name = name;
        groupToUpdate.limited_at = limited_at;

        // Save the changes
        const updatedGroup = await this.groupRepository.save(groupToUpdate);

        return response.json(updatedGroup);
    }

//Delete group
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let groupToRemove = await this.groupRepository.findOneBy({ id })

        if (!groupToRemove) {
            return "this group not exist"
        }

        await this.groupRepository.remove(groupToRemove)

        return "group has been removed"
    }

}