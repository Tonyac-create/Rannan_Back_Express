import { NextFunction, Request, Response } from "express"
import { GroupService } from "../service/GroupService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { UserService } from "../service/UserService"
import { RequestWithUser } from "../interface/RequestWithUser.interface"
import { ResponseInterface } from "../interface/ResponseInterface"
import { ContactService } from "../service/ContactService"
import { Contact } from "../entity/Contact"
import { ShareService } from "../service/ShareService"
import { requestMessage } from "../utils/nats-config"

export class GroupController {

// Services
    private groupService = new GroupService();
    private userService = new UserService();
    private contactService = new ContactService();
    private shareService = new ShareService();
    private responseMaker = new ResponseMaker();


// Enregistrer un nouveau groupe
    async save(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > { 
        try {
        // Vérification de la présence des champs requis
            if (!request.body) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // Modification format de Date
            const dateValue = request.body.limited_at;
            const parsedDate = dateValue ? new Date(dateValue) : null;
            const newGroup = {name: request.body.name, limited_at: parsedDate};
        // Création du groupe
            const savedGroup = await this.groupService.saveGroup(newGroup, +request.user.user_id);
        // Réponse
            return this.responseMaker.responseSuccess(201, `The group was saved`, savedGroup);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Récupérer la liste des groupes dont le user est membre
    async memberGroupList(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            if (!request.user) {
                throw { status: 400, message: "User undefined in request" }
            };
        // Récupération de la liste des groupes via populate "true"
            const user = await this.userService.findOne("id", request.user.user_id, true);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
        // Filtre les groupes pour que les groupes ou le user est creator n'apparaissent pas
            const filteredList = user.groups.filter((el: any) => el.creator_id !== user.id );
        // Filtre des fields envoyés et ajout du nickname du creator
            const allUsers = await this.userService.all();
            const userGroups = filteredList.map((element: any) => {
                const creator = allUsers.find((OneUser: any) => element.creator_id === OneUser.id);
                if (element.limited_at !== null) {
                    const date = new Date(element.limited_at);
                    const formattedDate = date.toISOString().split("T")[0];
                    return element = {
                        id: element.id, 
                        name: element.name, 
                        limited_at: formattedDate, 
                        creator_id: element.creator_id, 
                        creator_nickname: creator.nickname
                    };
                };
                return element = {
                    id: element.id, 
                    name: element.name, 
                    limited_at: null, 
                    creator_id: element.creator_id, 
                    creator_nickname: creator.nickname
                };
            });
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group how user is a member`, userGroups);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    // Récupérer la liste des groupes dont le user est créateur
    async creatorGroupList(request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
            if (!request.user) {
                throw { status: 400, message: "User undefined in request" }
            };
            const user = await this.userService.findOne("id", request.user.user_id, true);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
        // Récupération de la liste des groupes dont le user est creator
            const groupList = await this.groupService.allGroupsBy("creator_id", user.id);
        // Filtre des fields envoyés
            const creatorGroups = groupList.map((group: any) => {
                const { id, name} = group;
                if (group.limited_at !== null) {
                    const date = new Date(group.limited_at)
                    const formattedDate = date.toISOString().split("T")[0]
                    return group = { id: id, name: name, limited_at: formattedDate}
                };
                return group = { id: id, name: name, limited_at: null};
            });
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group how user is the creator`, creatorGroups);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Récupérer les détails d'un groupe
    async getGroupDetail (request: RequestWithUser, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // 
            const group = (await this.groupService.allGroupsBy("id", +request.params.id))[0];
            if (!group) {
                throw { status: 404, message: "Group not found" }
            };
            const getMemberList = await this.groupService.allGroupMember(+request.params.id);
            const memberList = getMemberList.users.map((member: { id: number, nickname: string }) => {
                const { id, nickname } = member
                return { id, nickname }
            });

            let dataList = [];
            const shares = await this.shareService.allByDatas("target_id", +request.params.id);
            if ( shares.length === 0 ){
                dataList = null
                return this.responseMaker.responseSuccess(201, `Group Details`, { memberList, dataList })
            };
            const datas = shares.filter((share: any) => share.target === "group")[0].datas;
            datas.map((data: any) => {
                dataList.push({id: data.id, name: data.name, value: data.value})
            });

        // Réponse
            return this.responseMaker.responseSuccess(201, `Group Details`, { memberList, dataList });
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Récupérer les informations (group details + member list + user contact list) pour groupSetting
    async getGroupDetailForSetting(request: RequestWithUser, response: Response, next: NextFunction): Promise< Object > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // 
            const foundGroup = await this.groupService.allGroupsBy("id", +request.params.id)[0];
            if (!foundGroup) {
                return this.responseMaker.responseSuccess(404, "Group not found");
            } else if (foundGroup.creator_id !== +request.user.user_id) {
                return this.responseMaker.responseSuccess(401, "You are not Creator");
            };
            const getMemberList = await this.groupService.allGroupMember(foundGroup.id);
            const memberList = getMemberList.users.map((member: { id: number, nickname: string }) => {
                const { id, nickname } = member
                return { id: id, nickname: nickname }
            });
        // Récupération de la liste de contact du user
            const contactList = [];
            const getContactList = await this.contactService.allByUserId(+request.user.user_id);
            await Promise.all(
                getContactList.map(async (contact: Contact) => {
                    if (contact.user1_id === +request.user.user_id) {
                        const findContact = await this.userService.findOne("id", contact.user2_id, false)
                        const nickname = findContact.nickname
                        contactList.push({id: findContact.id, nickname: nickname})
                    };
                    if (contact.user2_id === +request.user.user_id) {
                        const findContact = await this.userService.findOne("id", contact.user1_id, false)
                        const nickname = findContact.nickname
                        contactList.push({id: findContact.id, nickname: nickname})
                    };
                })
            );
        // Retrait des membres de la liste de contact
        const filteredContactList = contactList.filter((contact) => {
            // Vérifie si l'ID de l'élément ne correspond à aucun ID présent dans la liste des membres
            return !memberList.some((member) => member.id === contact.id);
        });
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group Details for Settings`, { memberList: memberList, contactList: filteredContactList });
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Supprimer un groupe par son id
    async remove(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // 
            const group = await this.groupService.allGroupsBy("id", +request.params.id)[0];
            if (!group) {
                throw { status: 404, message: "Group not found" }
            };
            const removedGroup =  await this.groupService.removeGroup(group.id);
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group ${group.name} was deleted`, removedGroup);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Mettre a jour un groupe par son id
    async update(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id || !request.body) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // Vérification de l'existence du groupe
            const group = await this.groupService.allGroupsBy("id", +request.params.id)[0];
            if (!group) {
                throw { status: 404, message: "Group not found" }
            };
        // Update des informations du groupe
            const updatedGroup = await this.groupService.updateGroup(group, request.body);
        // Réponse
            return this.responseMaker.responseSuccess(201, `Group was saved`, updatedGroup);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Ajouter un user dans un groupe
    async addMember(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.body) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // 
            const user = await this.userService.findOne("id", +request.body.user_id, true);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
            const group = await this.groupService.allGroupsBy("id", +request.params.id)[0];
            if (!group) {
                throw { status: 404, message: "Group not found" }
            };
            const addedUser = await this.groupService.addUserToGroup(user, group);
        // Réponse
            return this.responseMaker.responseSuccess(201, `User ${user.nickname} as been add to the group ${group.name}`, addedUser);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Supprimer un user d'un groupe
    async removeMember(request: Request, response: Response, next: NextFunction): Promise< ResponseInterface > {
        try {
        // Vérification de la présence des champs requis
            if (!request.body) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // 
            const user = await this.userService.findOne("id", +request.body.user_id, true);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
            const group = await this.groupService.allGroupsBy("id", +request.params.id)[0];
            if (!group) {
                throw { status: 404, message: "Group not found" }
            };
            const deletedUser = await this.groupService.deleteUserToGroup(user, group.id);
        // Réponse
            return this.responseMaker.responseSuccess(201, `User has been removed from group`, deletedUser);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    async getOneGroup(request: Request, response: Response, next: NextFunction)
    : Promise<ResponseInterface> {
        // Récupération via l'id de la data
        try {
            const id = +request.params.id
            console.log("🚀 ~ file: GroupController.ts:328 ~ GroupController ~ id:", id)
            const group = await this.groupService.getOneGroup(id)
            return group
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

}