import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"

export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group)

    //////////////////////A MODIFIER POUR RENVOYER UNIQUEMENT LE CREATOR_ID/////////////////////////

    async allWithCreator() : Promise<Group[]>
    {
        const groups = await this.groupRepository.find({
            relations: ['creator'] // Specify the name of the relation to include
        });
        return groups;
    }
    
    async allByCreatorId(creatorId: number): Promise<Group[]> {
        const groups = await this.groupRepository.find({
            where: { creator: { id: creatorId } },
            select: ["id", "name"], // Select only the necessary fields
            relations: ['creator']
        });
        return groups;
    }
    

    async saveGroup(name: string, creatorId: number): Promise<Group> {

        const group = this.groupRepository.create({
            name,
            creator: { id: creatorId }
        });

        const savedGroup = await this.groupRepository.save(group);
        return savedGroup;
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