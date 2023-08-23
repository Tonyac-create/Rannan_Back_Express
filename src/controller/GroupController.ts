import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Group } from "../entity/Group"
import { GroupService } from "../service/groupService"
export class GroupController {

    private groupRepository = AppDataSource.getRepository(Group)
    private groupService = new GroupService()

//Get all groups
    async all(request: Request, response: Response, next: NextFunction) {

        const groups = await this.groupService.allWithCreator()

        return response.json(groups);
    }

//Get group by creator id
    async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {

        const creatorId = parseInt(request.params.id);

        const groups = await this.groupService.allByCreatorId(creatorId)

        if (!groups || groups.length === 0) {
            return response.status(404).json({ error: "No groups found for the specified creator" });
        }

        return response.json(groups);
    }


// Add user to a group( A terminer)
    async addUserInGroup(request: Request, response: Response, next: NextFunction) {
        const userId = parseInt(request.params.id);
        const groupId = parseInt(request.body.groupId);

        if (isNaN(userId) || isNaN(groupId)) {
            return response.status(400).json({ error: "Invalid userId or groupId" });
        }
        console.log("coucou ici express  "+ groupId)
        try {
            const addedUser = await this.groupService.addUserToGroup(userId, groupId);
            return response.status(201).json(addedUser);
        } catch (error) {
            return response.status(500).json({ error: "An error occurred while adding user to group" });
        }
    }

//Post new group

    async save(request: Request, response: Response, next: NextFunction) {
        const { name, creatorId } = request.body;

        try {
            const savedGroup = await this.groupService.saveGroup(name, creatorId);
            return response.status(201).json(savedGroup);
        } catch (error) {
            // Gérer les erreurs, par exemple en renvoyant une réponse d'erreur appropriée
            console.error("Error while saving the group:", error); // Log the actual error

            return response.status(500).json({ error: "An error occurred while saving the group" });
        }
    }


// Update group
    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { name, limited_at } = request.body;

        try {
            const updatedGroup = await this.groupService.updateGroup(id, name, limited_at);
            return response.json(updatedGroup);
        } catch (error) {
            console.error("Error while updating the group:", error); // Log the actual error
            return response.status(500).json({ error: "An error occurred while updating the group" });
        }
    }

// Delete group
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        try {
            const removalResult = await this.groupService.removeGroup(id);
            return response.json(removalResult);
        } catch (error) {
            console.error("Error while removing the group:", error); // Log the actual error
            return response.status(500).json({ error: "An error occurred while removing the group" });
        }
    }


}