import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"
import { User } from "../entity/User"
import { GroupCreateInterface } from "../interface/GroupCreateInterface"
import { UserService } from "./UserService"

export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group)
    private userService = new UserService()

    async allGroupsBy(field: string, value: number): Promise<Object[]> {
        try {
            const groups = await this.groupRepository.find({where: {[field]: value}})
            if (!groups || groups.length === 0) {
                throw new Error("No groups found with specified creator")
            }
            const groupsFound = groups.map(group => {
                const { name, id, limited_at, creator_id } = group
                return { name, id, limited_at, creator_id }
            })
            return groupsFound
        } catch (error) {
            throw error.message
        }
    }

    async oneGroup(group_id: number): Promise<Group | undefined> {
        try {
            return await this.groupRepository.findOneBy({id: group_id})
        } catch (error) {
            throw error.message
        }
    }

    async saveGroup(body: GroupCreateInterface, creator_id: number): Promise< Group > {
        try {
            const newGroup = {
                name: body.name,
                limited_at: new Date(body.limited_at),
                creator_id: creator_id
            }
            return await this.groupRepository.save(newGroup)
        } catch (error) {
            throw error.message
        }
    }

    async updateGroup(group: Group, body: GroupCreateInterface): Promise<string | undefined> {
        try {
            const groupToUpdate = await this.groupRepository.update(group.id, body)
            if (groupToUpdate.affected === 0) {
                throw new Error("Group not updated")
            }
            return `Group ${group.name} has updated`
        } catch (error) {
            throw error.message
        }
    }

    async removeGroup(id: number): Promise< Group > {
        try {
            const group = await this.groupRepository.findOneBy({ id: id })
            if (!group) {
                throw new Error("Group not found")
            }
            await this.groupRepository.remove(group)
            return group
        } catch (error) {
            throw error.message
        }
    }

    async allUserGroups(user_id: number): Promise<Object[] | undefined> {
        try {
            const user = await this.userService.findOne("id", user_id, true)
            if (!user) {
                throw new Error("User not found")
            }
            const userGroups = user.groups.map(group => {
                const { name, id, limited_at, creator_id } = group
                return { name, id, limited_at, creator_id }
            })
            return userGroups
        } catch (error) {
            throw error.message
        }
    }

    async addUserToGroup(user: User, group: Group): Promise<string> {
        try {
            user.groups.map((el) => {
                if (el.id === group.id) {
                    throw new Error("User already in group")
                }
            })
            user.groups.push(group)
            await this.userService.saveUser(user)
            return `Utilisateur ${user.nickname} ajouté au groupe ${group.name}`
        } catch (error) {
            throw error.message
        }
    }

    async deleteUserToGroup(user: User, group_id: number): Promise<string> {
        try {
            const groupToDelete = user.groups.findIndex(group => group.id === group_id)
            if (!groupToDelete || groupToDelete < 0) {
                throw new Error("This user is not a member of this group")
            }
            const removedGroup = user.groups.splice(groupToDelete, 1)[0]
            await this.userService.saveUser(user)
            return `Utilisateur ${user.nickname} retiré du groupe ${removedGroup.name}`
        } catch (error) {
            throw error.message
        }
    }

    async allGroupMember(groupId: number): Promise< Group > {
        try {
            return this.groupRepository.findOne({
                where: { id: groupId },
                relations: ['users']
            })
        } catch (error) {
            throw error.message
        }
    }

}