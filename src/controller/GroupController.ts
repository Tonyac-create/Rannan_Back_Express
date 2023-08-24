import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/groupService"
export class GroupController {

    private groupService = new GroupService()

//Get all groups
    async all(request: Request, response: Response, next: NextFunction) {

        return this.groupService.allWithCreator()
    }
//Get one group by id

    async one(request: Request, response: Response, next: NextFunction) {
        const groupId = parseInt(request.params.id);
        try {
            const group = await this.groupService.findOne(groupId);
            return group;
        } catch (error) {
            return error;
        }
    }

//Get group by creator id
    async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {
        const creatorId = parseInt(request.params.id);

        try {
            const groups = await this.groupService.allByCreatorId(creatorId);

            if (!groups || groups.length === 0) {
                response.status(404).send("No groups found for the specified creator");
            } else {
                response.send(groups);
            }
        } catch (error) {
            console.error("Error while fetching groups by creator id:", error);
            response.status(500).send("An error occurred while fetching groups by creator id");
        }
    }



// Add user to a group

    async addUserInGroup(request: Request, response: Response, next: NextFunction) {
        const userId = parseInt(request.params.id);
        const groupId = parseInt(request.body.groupId);
        try {
            const addedUser = await this.groupService.addUserToGroup(userId, groupId);
            return addedUser;
        } catch (error) {
            return error
        }
    }
// Delete user to a group

    async deleteUserInGroup(request: Request, response: Response, next: NextFunction) {
        const userId = parseInt(request.params.id);
        const groupId = parseInt(request.body.groupId);
        try {
            const removedUser = await this.groupService.deleteUserToGroup(userId, groupId);
            return removedUser;
        } catch (error) {
            return error;
        }
    }

//Post new group

    async save(request: Request, response: Response, next: NextFunction) { 
        try {
            const { name, creatorId } = request.body;
            const savedGroup = await this.groupService.saveGroup(name, creatorId); // Pass the individual arguments
            return savedGroup; // Return the saved group with a success status
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
            return updatedGroup;
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
            return removalResult;
        } catch (error) {
            console.error("Error while removing the group:", error); // Log the actual error
            return response.status(500).json({ error: "An error occurred while removing the group" });
        }
    }


}