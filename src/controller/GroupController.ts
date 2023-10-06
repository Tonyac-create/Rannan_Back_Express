import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { UserService } from "../service/UserService"

export class GroupController {

// Services
    private groupService = new GroupService()
    private userService = new UserService()
    private responseMaker = new ResponseMaker()

// Récupération d'un groupe par son id
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            return this.responseMaker.responseSuccess(`Group id: ${group.id}`, group)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Enregistrer un nouveau groupe
    async save(request: Request, response: Response, next: NextFunction) { 
        try {
            const savedGroup = await this.groupService.saveGroup(request.body)
            return this.responseMaker.responseSuccess(`The group was saved`, savedGroup)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Mettre a jour un groupe par son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            const updatedGroup = await this.groupService.updateGroup(group.id, request.body)
            return this.responseMaker.responseSuccess(`Group was saved`, updatedGroup)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un groupe par son id
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            const removedGroup =  await this.groupService.removeGroup(group.id)
            return this.responseMaker.responseSuccess(`Group was deleted`, removedGroup)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupération de tout les groupes par le creator_id
async groupsByCreatorId(request: Request, response: Response, next: NextFunction) {
    try {
        const user = await this.userService.findOne("id", +request.params.id, false)
        if (!user) {
            throw new Error("Creator not found")
        }
        const groups = await this.groupService.allGroupsBy("creator_id", user.id)
        if (!groups || groups.length === 0) {
            throw new Error("Zero groups found")
        }
        return this.responseMaker.responseSuccess(`Group created by: ${user.nickname}`, groups)
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}

// Récupération de tout les groupes d'un user par l'id du user
    async allUserGroups(request: Request, response: Response, next: NextFunction) {
        try {
            const user = await this.userService.findOne("id", +request.params.id, false)
            if (!user) {
                throw new Error("User not found")
            }
            const userGroups = await this.groupService.allUserGroups(user.id)
            if (!userGroups || userGroups.length === 0) {
                throw new Error("Zero groups found")
            }
            return this.responseMaker.responseSuccess(`All groups of: ${+request.params.id}`, userGroups)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Ajouter un user dans un groupe
    async addUserInGroup(request: Request, response: Response, next: NextFunction) {
        try {
            const user = await this.userService.findOne("id", +request.body.userId, false)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupService.oneGroup(+request.body.groupId)
            if (!group) {
                throw new Error("Group not found")
            }
            const addedUser = await this.groupService.addUserToGroup(user.id, group.id)
            return this.responseMaker.responseSuccess(`User ${user.nickname} as been add to the group ${group.name}`, addedUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un user d'un groupe
    async deleteUserInGroup(request: Request, response: Response, next: NextFunction) {
        try {
            const user = await this.userService.findOne("id", +request.body.userId, false)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupService.oneGroup(+request.body.groupId)
            if (!group) {
                throw new Error("Group not found")
            }
            const deletedUser = await this.groupService.deleteUserToGroup(user.id, group.id)
            return this.responseMaker.responseSuccess(`User ${user.nickname} has been deleted from group ${group.name}`, deletedUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }
}