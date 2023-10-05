import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { UserService } from "../service/UserService"

export class GroupController {

// Services
    private groupService = new GroupService()
    private userService = new UserService()

// Récupération de tout les groupes
    async all(request: Request, response: Response, next: NextFunction) {
        return this.groupService.allGroups()
    }

// Récupération d'un groupe par son id
    async one(request: Request, response: Response, next: NextFunction) {
        const groupId = parseInt(request.params.id);
        try {
            const group = await this.groupService.findOne(groupId);
            return group;
        } catch (error) {
            return error;
        }
    }

// Enregistrer un nouveau groupe
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

// Mettre a jour un groupe par son id
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

// Supprimer un groupe par son id
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        try {
            const removalResult = await this.groupService.removeGroup(id);
            return removalResult;
        } catch (error) {
            throw new Error("Error while removing the group"); 
        }
    }

// Récupération de tout les groupes par le creator_id
    async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {
        const creator_id = parseInt(request.params.id);
        try {
            const groups = await this.groupService.allByCreatorId(creator_id);
            if (!groups) {
                throw new Error("No groups found for the specified creator");
            } 
            response.send(groups);
        } catch (error) {
            throw new Error("An error occurred while fetching groups by creator id");
        }
    }

// Récupération de tout les groupes d'un user par l'id du user
    async allUserGroups(request: Request, response: Response, next: NextFunction) {
    try {
        return "En cour de développement"
    } catch (error) {
        return error
    }
    }

// Ajouter un user dans un groupe
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

// Supprimer un user d'un groupe
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