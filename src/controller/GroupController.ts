import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"

export class GroupController {

// Services
    private groupService = new GroupService()

//Get all groups
    async all(request: Request, response: Response, next: NextFunction) {
        return this.groupService.allGroups()
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

//Post new group
    async save(request: Request, response: Response, next: NextFunction) { 
        try {
            const { name, creator_id } = request.body;
            const savedGroup = await this.groupService.saveGroup(name, creator_id); // Pass the individual arguments
            return savedGroup; // Return the saved group with a success status
        } catch (error) {
            // Gérer les erreurs, par exemple en renvoyant une réponse d'erreur appropriée
            throw new Error("Error while saving the group"); 
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
            throw new Error("Error while updating the group:"); 
        }
    }

// Delete group
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        try {
            const removalResult = await this.groupService.removeGroup(id);
            return removalResult;
        } catch (error) {
            throw new Error("Error while removing the group"); 
        }
    }

//Get group by creator id
    async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {
        const creator_id = parseInt(request.params.id);
        try {
            return creator_id //! ajouté lors du merge total pour avoir un retour et éviter l'erreur
            // const groups = await this.groupService.allByCreatorId(creator_id);
            // if (!groups || groups.length === 0) {
            //     throw new Error("No groups found for the specified creator");
            // } 
            // response.send(groups);
        } catch (error) {
            throw new Error("An error occurred while fetching groups by creator id");
        }
    }

// Find all groups of a user by user id
    async allUserGroups(request: Request, response: Response, next: NextFunction) {
    try {
        const user_id = parseInt(request.params.id) //? ajouté lors du merge total pour créer la route
        return user_id //? ajouté lors du merge total pour créer la route
    } catch (error) {
        return error
    }
    }

// Add user to a group
    async addUserInGroup(request: Request, response: Response, next: NextFunction) {
        const userId = parseInt(request.body.userId);
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
        const userId = parseInt(request.body.userId);
        const groupId = parseInt(request.body.groupId);
        try {
            const removedUser = await this.groupService.deleteUserToGroup(userId, groupId);
            return removedUser;
        } catch (error) {
            return error;
        }
    }


}