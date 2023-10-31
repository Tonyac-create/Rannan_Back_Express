import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { UserService } from "../service/UserService"
import { RequestWithUser } from "../interface/RequestWithUser.interface"
import { ResponseInterface } from "../interface/ResponseInterface"
import { ContactService } from "../service/ContactService"
import { Contact } from "../entity/Contact"

export class GroupController {

// Services
    private groupService = new GroupService()
    private userService = new UserService()
    private contactService = new ContactService()
    private responseMaker = new ResponseMaker()


// Enregistrer un nouveau groupe
    async save(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > { 
        try {
        // Création du groupe
            const savedGroup = await this.groupService.saveGroup(request.body, +request.user.user_id)
        // Ajout des users en membres
            request.body.memberList.map(async (id: number) => {
                const user = await this.userService.findOne("id", id, false)
                if (user) {
                    this.groupService.addUserToGroup(user, savedGroup)
                }
            })

            return this.responseMaker.responseSuccess(201, `The group was saved`, savedGroup)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupérer la liste des groupes dont le user est membre
    async memberGroupList(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            if (!request.user) {
                throw new Error("User undefined in request")
            }
        // Vérification de l'existence du user
            const user = await this.userService.findOne("id", request.user.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
        // Filtre les fields envoyé
            const userGroups = user.groups.map((group: {name: string, id: number, limited_at: Date | null, creator_id: number}) => {
                const { id, name } = group
                return { id, name }
            })

            return this.responseMaker.responseSuccess(201, `Group how user is a member`, userGroups)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

    // Récupérer la liste des groupes dont le user est créateur
    async creatorGroupList(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            
            if (!request.user) {
                throw new Error("User undefined in request")
            }
            const user = await this.userService.findOne("id", request.user.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
            const creatorGroups = await this.groupService.allGroupsBy("creator_id", user.id)
            const foundGroups = creatorGroups.map((group: {name: string, id: number, limited_at: Date | null, creator_id: number}) => {
                const { id, name} = group
                return { id, name}
            })

            return this.responseMaker.responseSuccess(201, `Group how user is the creator`, foundGroups)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupérer les détails d'un groupe
    async getGroupDetail (request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            const foundGroup = await this.groupService.oneGroup(+request.params.id)
            if (!foundGroup) {
                throw new Error("Group not found")
            }
            const group = { name: foundGroup.name, limited_at: foundGroup.limited_at, creator_id: foundGroup.creator_id }
            const getMemberList = await this.groupService.allGroupMember(foundGroup.id)
            const memberList = getMemberList.users.map((member: { id: number, nickname: string }) => {
                const { id, nickname } = member
                return { id, nickname }
            })

        //! => A VOIR AVEC ANGELIQUE POUR DATA
            const dataList = ["a voir coté dataService"]
            console.log("🐼 ~ file: GroupController.ts:96 ~ getGroupDetail ~ dataList:", dataList)


            return this.responseMaker.responseSuccess(201, `Group Details`, { group, memberList, dataList })

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupérer les informations (group details + member list + user contact list) pour groupSetting
    async getGroupDetailForSetting(request: RequestWithUser, response: Response, next: NextFunction): Promise< Object > {
        try {
            const foundGroup = await this.groupService.oneGroup(+request.params.id)
            if (!foundGroup) {
                throw new Error("Group not found")
            } else if (foundGroup.creator_id !== +request.user.user_id) {
                throw new Error("You are not Creator")
            }
            const group = { name: foundGroup.name, limited_at: foundGroup.limited_at }
            const getMemberList = await this.groupService.allGroupMember(foundGroup.id)
            const memberList = getMemberList.users.map((member: { id: number, nickname: string }) => {
                const { id, nickname } = member
                return { id, nickname }
            })
        // Récupération de la liste de contact du user
            const contactList = []
            const getContactList = await this.contactService.allByUserId(+request.user.user_id)
            await Promise.all(
                getContactList.map(async (contact: Contact) => {
                    if (contact.user1_id === +request.user.user_id) {
                        const findContact = await this.userService.findOne("id", contact.user2_id, false)
                        const nickname = findContact.nickname
                        contactList.push({id: findContact.id, nickname: nickname})
                    }
                    if (contact.user2_id === +request.user.user_id) {
                        const findContact = await this.userService.findOne("id", contact.user1_id, false)
                        const nickname = findContact.nickname
                        contactList.push({id: findContact.id, nickname: nickname})
                    }
                })
            )

            return this.responseMaker.responseSuccess(201, `Group Details for Settings`, { group, memberList, contactList })

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un groupe par son id
    async remove(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            const removedGroup =  await this.groupService.removeGroup(group.id)

            return this.responseMaker.responseSuccess(201, `Group ${group.name} was deleted`, removedGroup)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Mettre a jour un groupe par son id
    async update(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de l'existence du groupe
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
        // Update des informations du groupe
            const updatedGroup = await this.groupService.updateGroup(group, request.body)

            return this.responseMaker.responseSuccess(201, `Group was saved`, updatedGroup)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Ajouter un user dans un groupe
    async addMember(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            const user = await this.userService.findOne("id", +request.body.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupService.oneGroup(+request.body.group_id)
            if (!group) {
                throw new Error("Group not found")
            }
            const addedUser = await this.groupService.addUserToGroup(user, group)

            return this.responseMaker.responseSuccess(201, `User ${user.nickname} as been add to the group ${group.name}`, addedUser)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un user d'un groupe
    async removeMember(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            const user = await this.userService.findOne("id", +request.body.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupService.oneGroup(+request.body.group_id)
            if (!group) {
                throw new Error("Group not found")
            }
            const deletedUser = await this.groupService.deleteUserToGroup(user, group.id)

            return this.responseMaker.responseSuccess(201, `User ${user.nickname} has been deleted from group ${group.name}`, deletedUser)

        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }
}