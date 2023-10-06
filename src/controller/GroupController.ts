import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { UserService } from "../service/UserService"

export class GroupController {

// Services
    private groupService = new GroupService()
    private userService = new UserService()

// Récupération d'un groupe par son id
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                response.status(404).send("Group not found")
            } else {
                response.status(201).send(group)
            }
        } catch (error) {
            response.status(400).send("GroupController.all ERROR :" + error)
        }
    }

// Enregistrer un nouveau groupe
    async save(request: Request, response: Response, next: NextFunction) { 
        try {
            const { name, creator_id } = request.body;
            const savedGroup = await this.groupService.saveGroup({name, creator_id});
            return savedGroup;
        } catch (error) {
            response.status(400).send("GroupController.save ERROR :" + error)
        }
    }

// Mettre a jour un groupe par son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const update = await this.groupService.updateGroup(+request.params.id, request.body);
            response.send(update)
        } catch (error) {
            response.status(400).send("GroupController.update ERROR :" + error)
        }
    }

// Supprimer un groupe par son id
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const removedGroup = await this.groupService.removeGroup(+request.params.id);
            response.send(removedGroup)
        } catch (error) {
            response.status(400).send("GroupController.remove ERROR :" + error)
        }
    }

// Récupération de tout les groupes par le creator_id
    async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {
        try {
            const groups = await this.groupService.allGroupsBy("creator_id", +request.params.id);
            response.send(groups);
        } catch (error) {
            response.status(400).send("GroupController.groupsByCreatorId ERROR :" + error)
        }
    }

// Récupération de tout les groupes d'un user par l'id du user
    async allUserGroups(request: Request, response: Response, next: NextFunction) {
    try {
        return await this.groupService.allUserGroups(+request.params.id)
    } catch (error) {
        response.status(400).send("GroupController.allUserGroups ERROR :" + error)
    }
    }

// Ajouter un user dans un groupe
    async addUserInGroup(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.groupService.addUserToGroup(+request.body.userId, +request.body.groupId);
        } catch (error) {
            response.status(400).send("GroupController.addUserInGroup ERROR :" + error)
        }
    }

// Supprimer un user d'un groupe
    async deleteUserInGroup(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.groupService.deleteUserToGroup(+request.body.userId, +request.body.groupId);
        } catch (error) {
            response.status(400).send("GroupController.deleteUserInGroup ERROR :" + error)
        }
    }


}