import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"
import { GroupCreateInterface } from "../interface/GroupInterface"
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

    async oneGroup(groupId: number): Promise<Group | undefined> {
        try {
            return await this.groupRepository.findOneBy({id: groupId})
        } catch (error) {
            throw error.message
        }
    }

    async saveGroup(body: GroupCreateInterface): Promise<Group | { success: string; message: string }> {
        try {
            return await this.groupRepository.save(body)
        } catch (error) {
            throw error.message
        }
    }

    async updateGroup(id: number, body: GroupCreateInterface): Promise<string | undefined> {
        try {
            const group = await this.groupRepository.findOneBy({ id: id })
            if (!group) {
                throw new Error("Group not found")
            }
            const groupToUpdate = await this.groupRepository.update(id, body)
            if (groupToUpdate.affected === 0) {
                throw new Error("Group not updated")
            }
            return `Group ${group.name} has updated`
        } catch (error) {
            throw error.message
        }
    }

    async removeGroup(id: number): Promise<string> {
        try {
            const group = await this.groupRepository.findOneBy({ id: id })
            if (!group) {
                throw new Error("Group not found")
            }
            await this.groupRepository.remove(group)
            return `Group ${group.name} has deleted`
        } catch (error) {
            throw error.message
        }
    }

    async allUserGroups(userId: number): Promise<Object[] | undefined> {
        try {
            const user = await this.userService.findOne("id", userId, true)
            if (!user) {
                throw new Error("User not found")
            }
            const groups = user.groups.map(group => {
                const { name, id, limited_at, creator_id } = group
                return { name, id, limited_at, creator_id }
            })
            return groups
        } catch (error) {
            throw error.message
        }
    }

    async addUserToGroup(userId: number, groupId: number): Promise<string> {
        try {
            const user = await this.userService.findOne("id", userId, true)
            if (!user) {
                throw new Error("User not found")
            }
            const group = await this.groupRepository.findOneBy({ id: groupId })
            if (!group) {
                throw new Error("Group not found")
            }
            user.groups.push(group)
            await this.userService.saveUser(user)
            return `Utilisateur ${user.nickname} ajouté au groupe ${group.name}`
        } catch (error) {
            throw error.message
        }
    }

    async deleteUserToGroup(userId: number, groupId: number): Promise<string> {
        try {
            const user = await this.userService.findOne("id", userId, true)
            if (!user) {
                throw new Error("User not found")
            }
            const groupToDelete = user.groups.findIndex(group => group.id === groupId)
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

}