import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"
import { User } from "../entity/User"
export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group)
    private userRepository = AppDataSource.getRepository(User)


    //////////////////////A MODIFIER POUR RENVOYER UNIQUEMENT LE CREATOR_ID/////////////////////////
    async allGroups() : Promise<Group[]>
    {
        const groups = await this.groupRepository.find({});
        return groups;
    }
    
    async allByCreatorId(creator_id: number): Promise<Group[]> {
        const groups = await this.groupRepository.find({
            where: { creator_id: creator_id }
        });
        return groups;
    }

    async addUserToGroup(userId: number, groupId: number): Promise<Group | User> {
        try {
            const users = await this.userRepository.find({
                where: { id: userId },
                relations: ['groups'] // Load the 'groups' relation for the user
            });
    
            if (!users || users.length === 0) {
                throw new Error("User not found");
            }
    
            const userToUpdate = users[0];
    
            const group = await this.groupRepository.findOneBy({ id:groupId });
            if (!group) {
                throw new Error("Group not found");
            }
    
            userToUpdate.groups = [...userToUpdate.groups, group]; // Add user to the existing groups
    
            await this.userRepository.save(userToUpdate);
    
            return userToUpdate.groups.find(g => g.id === groupId);
        } catch (error) {
            console.error("Error while adding user to group:", error);
            throw new Error("An error occurred while adding user to group");
        }
    } 
    
    
    
    async saveGroup(name: string,creator_id: number, members: Array<number>) {
        try {
            const group = this.groupRepository.create({
                name,
                creator_id
            });
            return await this.groupRepository.save(group);
        } catch (error) {
            return {
                success: 'ko',
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

}