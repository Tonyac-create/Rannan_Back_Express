import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"

export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group)

    async allWithCreator() : Promise<Group[]>
    {
        const groups = await this.groupRepository.find({
            relations: ['creator'] // Specify the name of the relation to include
        });
        console.log("groups", groups)
        return groups;
    }

    async allByCreatorId(creatorId :number):Promise<Group[]>{
        const groups = await this.groupRepository.find({
            where: { creator: { id: creatorId } },
            relations: ['creator'] // Optionally include creator details
        });
        return groups;
    }

}