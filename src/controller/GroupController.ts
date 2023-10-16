import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { UserService } from "../service/UserService"
import { RequestWithUser } from "../interface/RequestWithUser.interface"

export class GroupController {

// Services
    private groupService = new GroupService()
    private userService = new UserService()
    private responseMaker = new ResponseMaker()

// Récupérer la liste des groupes dont le user est membre
    async myGroupList(request: RequestWithUser, response: Response, next: NextFunction){
        try {
            
            if (!request.user) {
                throw new Error("User undefined in request")
            }
            const user = await this.userService.findOne("id", request.user.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
            const userGroups = user.groups.map(group => {
                const { id, name } = group
                return { id, name }
            })
            return userGroups
            
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

    // Récupérer la liste des groupes dont le user est créateur
    async creatorGroupList(request: RequestWithUser, response: Response, next: NextFunction){
        try {
            
            if (!request.user) {
                throw new Error("User undefined in request")
            }
            const user = await this.userService.findOne("id", request.user.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
            const creatorGroups = await this.groupService.allGroupsBy("creator_id", user.id)
            const foundGroups = creatorGroups.map((group: {name: string, id: number, limited_at: any, creator_id: number}) => {
                const { id, name} = group
                return { id, name}
            })
            return foundGroups
            
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupérer les détails d'un groupe
    async getGroupDetail (request: Request, response: Response, next: NextFunction) {
        try {
            const foundGroup = await this.groupService.oneGroup(+request.params.id)
            if (!foundGroup) {
                throw new Error("Group not found")
            }
            const group = { name: foundGroup.name, limited_at: foundGroup.limited_at }
            const getMemberList = await this.groupService.allGroupMember(foundGroup.id)
            const memberList = getMemberList.users.map(member => {
                const { id, nickname } = member
                return { id, nickname }
            })

//! => A VOIR AVEC ANGELIQUE POUR DATA
            const dataList = []


            return { group, memberList, dataList }
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

// Récupérer les informations (group details + member list + user contact list) pour groupSetting
    async getGroupDetailForSetting(request: RequestWithUser, response: Response, next: NextFunction){
        try {
            const foundGroup = await this.groupService.oneGroup(+request.params.id)
            if (!foundGroup) {
                throw new Error("Group not found")
            } else if (foundGroup.creator_id !== +request.user.user_id) {
                throw new Error("You are not Creator")
            }
            const group = { name: foundGroup.name, limited_at: foundGroup.limited_at }
            const getMemberList = await this.groupService.allGroupMember(foundGroup.id)
            const memberList = getMemberList.users.map(member => {
                const { id, nickname } = member
                return { id, nickname }
            })

//! => A VOIR AVEC CAYE POUR CONTACT
            const contactList = []


            return { group, memberList, contactList }
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








//* -------------------------------------------
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