import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"
import { User } from "../entity/User"
import { GroupCreateInterface } from "../interface/GroupInterface"
import { UserService } from "./UserService"

export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group)
    private userService = new UserService()

    async allGroupsBy(field: string, value: number) {
        const groups = await this.groupRepository.find({where: {[field]: value}})
        if (!groups || groups.length === 0) return "No groups found with specified creator"
        const groupsFound = groups.map(group => {
            const { name, id, limited_at, creator_id } = group
            return { name, id, limited_at, creator_id }
        })
        return groupsFound
    }

    async oneGroup(groupId: number): Promise<Group | undefined> {
        try {
            const group = await this.groupRepository.findOneBy({id: groupId})
            return group;
        } catch (error) {
            console.error("Error while fetching group:", error);
            throw new Error("An error occurred while fetching group");
        }
    }

    async saveGroup(groupData: {name: string, creator_id: number}): Promise<Group | { success: string; message: string }> {
        try {
            const newGroup = this.groupRepository.create(groupData)
            return await this.groupRepository.save(newGroup)
        } catch (error) {
            return {
                success: 'KO',
                message: error.message
            };
        }
    }

    async updateGroup(id: number, body: GroupCreateInterface): Promise<string | undefined> {
        try {
            const group = await this.groupRepository.findOneBy({ id: id })
            if (!group) return "Group not found"
            const groupToUpdate = await this.groupRepository.update(id, body)
            if (groupToUpdate.affected === 0) {
                return "Group not updated"
            }
            return `Group ${group.name} has updated`
        } catch (error) {
            console.log("error :", error);
        }
    }

    async removeGroup(id: number) {
        const group = await this.groupRepository.findOneBy({ id: id })
        if (!group) return "group not found"
        await this.groupRepository.remove(group)
        return `Group ${group.name} has deleted`
    }

    async allUserGroups(userId: number) {
        const user = await this.userService.findOne("id", userId, true)
        if (!user) return "User not found"
        const groups = user.groups.map(group => {
            const { name, id, limited_at, creator_id } = group
            return { name, id, limited_at, creator_id }
        })
        return groups
    }

    async addUserToGroup(userId: number, groupId: number): Promise<String> {
        try {
            const user = await this.userService.findOne("id", userId, true)
            if (!user) return "User not found"
            const group = await this.groupRepository.findOneBy({ id: groupId })
            if (!group) return "Group not found"
            user.groups.push(group)
            await this.userService.create(user)
            return `Utilisateur ${user.nickname} ajouté au groupe ${group.name}`
        } catch (error) {
            console.error("Error while adding user to group:", error);
            throw new Error("An error occurred while adding user to group");
        }
    }

    async deleteUserToGroup(userId: number, groupId: number): Promise<string> {
        try {
            const user = await this.userService.findOne("id", userId, true)
            if (!user) {
                return "User not found"
            }
            const groupToDelete = user.groups.findIndex(group => group.id === groupId)
            if (!groupToDelete || groupToDelete < 0) {
                return ("This user wasn't in this group")
            }
            const removedGroup = user.groups.splice(groupToDelete, 1)[0]
            await this.userService.create(user)
            return `Utilisateur ${user.nickname} retiré du groupe ${removedGroup.name}`
        } catch (error) {
            console.error("Error while adding user to group:", error)
        }
    }

}