import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { UserService } from "../service/UserService"
import { RequestWithUser } from "../interface/RequestWithUser.interface"
import { ResponseInterface } from "../interface/ResponseInterface"
import { ContactService } from "../service/ContactService"
import { Contact } from "../entity/Contact"
import { DataService } from "../service/DataService"
import { ShareService } from "../service/ShareService"

export class GroupController {

// Services
    private groupService = new GroupService()
    private userService = new UserService()
    private contactService = new ContactService()
    private shareService = new ShareService()
    private dataService = new DataService()
    private responseMaker = new ResponseMaker()


// Enregistrer un nouveau groupe
    async save(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > { 
        try {
        // Vérification de la présence des champs requis
            if (!request.body) {
                throw new Error("Received informations not complet")
            }
        // Modification format de Date
            const dateValue = request.body.limited_at
            const parsedDate = dateValue ? new Date(dateValue) : null;
            const newGroup = {name: request.body.name, limited_at: parsedDate}
        // Création du groupe
            const savedGroup = await this.groupService.saveGroup(newGroup, +request.user.user_id)
        // Réponse
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
        // Récupération de la liste des groupes via populate "true"
            const user = await this.userService.findOne("id", request.user.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
        // Filtre les groupes pour que les groupes ou le user est creator n'apparaissent pas
            const filteredList = user.groups.filter((el: any) => el.creator_id !== user.id )
        // Filtre des fields envoyés et ajout du nickname du creator
            const allUsers = await this.userService.all()
            const userGroups = filteredList.map((element: any) => {
                const creator = allUsers.find((OneUser: any) => element.creator_id === OneUser.id)
                if (element.limited_at !== null) {
                    const date = new Date(element.limited_at)
                    const formattedDate = date.toISOString().split("T")[0]
                    return element = {id: element.id, name: element.name, limited_at: formattedDate, creator_id: element.creator_id, creator_nickname: creator.nickname}
                }
                return element = {id: element.id, name: element.name, limited_at: null, creator_id: element.creator_id, creator_nickname: creator.nickname}
            })
        // Réponse
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
        // Récupération de la liste des groupes dont le user est creator
            const groupList = await this.groupService.allGroupsBy("creator_id", user.id)
        // Filtre des fields envoyés
            const creatorGroups = groupList.map((group: any) => {
                const { id, name} = group
                if (group.limited_at !== null) {
                    const date = new Date(group.limited_at)
                    const formattedDate = date.toISOString().split("T")[0]
                    return group = { id: id, name: name, limited_at: formattedDate}
                }
                return group = { id: id, name: name, limited_at: null}
            })
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group how user is the creator`, creatorGroups)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupérer les détails d'un groupe
    async getGroupDetail (request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw new Error("Received informations not complet")
            }
        // 
            const foundGroup = await this.groupService.oneGroup(+request.params.id)
            if (!foundGroup) {
                throw new Error("Group not found")
            }
            const getMemberList = await this.groupService.allGroupMember(foundGroup.id)
            const memberList = getMemberList.users.map((member: { id: number, nickname: string }) => {
                const { id, nickname } = member
                return { id, nickname }
            })

            
            const dataList = [{id: 1, name: "data", value: "value"}, {id: 2, name: "data2", value: "value2"}]
            console.log("🐼 ~ file: GroupController.ts:96 ~ getGroupDetail ~ dataList:", ["a voir coté dataService"])

        // Réponse
            return this.responseMaker.responseSuccess(201, `Group Details`, { memberList, dataList })
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupérer les informations (group details + member list + user contact list) pour groupSetting
    async getGroupDetailForSetting(request: RequestWithUser, response: Response, next: NextFunction): Promise< Object > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw new Error("Received informations not complet")
            }
        // 
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
                return { id: id, nickname: nickname }
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
        // Retrait des membres de la liste de contact
        const filteredContactList = contactList.filter((contact) => {
            // Vérifie si l'ID de l'élément ne correspond à aucun ID présent dans la liste des membres
            return !memberList.some((member) => member.id === contact.id);
        })
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group Details for Settings`, { memberList: memberList, contactList: filteredContactList })
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un groupe par son id
    async remove(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw new Error("Received informations not complet")
            }
        // 
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            const removedGroup =  await this.groupService.removeGroup(group.id)
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group ${group.name} was deleted`, removedGroup)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Mettre a jour un groupe par son id
    async update(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id || !request.body) {
                throw new Error("Received informations not complet")
            }
        // Vérification de l'existence du groupe
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
        // Update des informations du groupe
            const updatedGroup = await this.groupService.updateGroup(group, request.body)
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group was saved`, updatedGroup)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Ajouter un user dans un groupe
    async addMember(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.body) {
                throw new Error("Received informations not complet")
            }
        // 
            const user = await this.userService.findOne("id", +request.body.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            const addedUser = await this.groupService.addUserToGroup(user, group)
        // Réponse
            return this.responseMaker.responseSuccess(201, `User ${user.nickname} as been add to the group ${group.name}`, addedUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un user d'un groupe
    async removeMember(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.body) {
                throw new Error("Received informations not complet")
            }
        // 
            const user = await this.userService.findOne("id", +request.body.user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupService.oneGroup(+request.params.id)
            if (!group) {
                throw new Error("Group not found")
            }
            const deletedUser = await this.groupService.deleteUserToGroup(user, group.id)
        // Réponse
            return this.responseMaker.responseSuccess(201, `User has been removed from group`, deletedUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }
}