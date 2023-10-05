import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"
import { User } from "../entity/User"

export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group)
    private userRepository = AppDataSource.getRepository(User) //? a remplacer par le userService?


    async allGroups() : Promise<Group[]>
    {
        const groups = await this.groupRepository.find({});
        return groups;
    }

    async findOne(groupId: number): Promise<Group | undefined> {
        try {
            const group = await this.groupRepository.findOne({
                where: { id: groupId }
            });
            return group;
        } catch (error) {
            console.error("Error while fetching group:", error);
            throw new Error("An error occurred while fetching group");
        }
    }

    async saveGroup(name: string, creator_id: number): Promise<Group | { success: string; message: string }> {
        try {
            const newGroup = {
                name: name,
                creator_id: creator_id
            }
            const savedGroup = this.groupRepository.create(newGroup)
            return await this.groupRepository.save(savedGroup)
        } catch (error) {
            return {
                success: 'KO',
                message: error.message
            };
        }
    }

    async updateGroup(id: number, name: string, limited_at: Date | null): Promise<Group | undefined> {
        const groupToUpdate = await this.groupRepository.findOneBy({ id })
        if (!groupToUpdate) {
            throw new Error("Group not found");
        }
        groupToUpdate.name = name;
        groupToUpdate.limited_at = limited_at;
        const updatedGroup = await this.groupRepository.save(groupToUpdate);
        return updatedGroup;
    }

    async removeGroup(id: number): Promise<string> {
        const groupToRemove = await this.groupRepository.findOneBy({ id })
        if (!groupToRemove) {
            throw new Error("Group not found");
        }
        await this.groupRepository.remove(groupToRemove);
        return "Group has been removed";
    }

    async allByCreatorId(creator_id: number): Promise<Group[]> {
        const groups = await this.groupRepository.find({where: { creator_id: creator_id }});
        return groups;
    }

    async addUserToGroup(userId: number, groupId: number): Promise<String> {
        try {
            const users = await this.userRepository.find({ //? a remplacer par le userService?
                where: { id : userId },
                relations: ['groups'] // Load the 'groups' relation for the user
            });
            if (!users) {
                throw new Error("User not found");
            }
            const userToUpdate = users[0];
            const group = await this.groupRepository.findOneBy({ id: groupId });
            if (!group) {
                throw new Error("Group not found");
            }
            userToUpdate.groups = [...userToUpdate.groups, group]; // Add user to the existing groups
            await this.userRepository.save(userToUpdate); //? a remplacer par le userService?
            return "Utilisateur ajouté au groupe";
        } catch (error) {
            console.error("Error while adding user to group:", error);
            throw new Error("An error occurred while adding user to group");
        }
    }

    async deleteUserToGroup(userId: number, groupId: number): Promise<string> {
        try {
            const user = await this.userRepository.findOne({ //? a remplacer par le userService?
                where: { id: userId },
                relations: ['groups'] // Load the 'groups' relation for the user
            });
            if (!user) {
                return "User not found"
            }
            const groupToDelete = user.groups.findIndex(group => group.id === groupId)
            if (!groupToDelete) {
                return ("Group not found for this user")
            }
            const removedGroup = user.groups.splice(groupToDelete, 1)[0]
            await this.userRepository.save(user) //? a remplacer par le userService?
            return `Utilisateur retiré du groupe ${removedGroup.name}`
        } catch (error) {
            console.error("Error while adding user to group:", error)
        }
    }

}