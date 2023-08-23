import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Group } from "../entity/Group"

export class GroupController {

    private groupRepository = AppDataSource.getRepository(Group)

//Get all groups
    async all(request: Request, response: Response, next: NextFunction) {
        return this.groupRepository.find()
    }

//Get group by id
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const group = await this.groupRepository.findOne({
            where: { id }
        })

        if (!group) {
            return "unregistered group"
        }
        return group
    }

//Post new group
    async save(request: Request, response: Response, next: NextFunction) {
        const { name } = request.body;

        const group = Object.assign(new Group(), {
            name
        })

        return this.groupRepository.save(group)
    }

//Update group
    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { name, limited_at } = request.body;

        // Find the group to update
        const groupToUpdate = await this.groupRepository.findOneBy({ id })

        if (!groupToUpdate) {
            return response.status(404).json({ error: "Group not found" });
        }

        // Update fields
        groupToUpdate.name = name;
        groupToUpdate.limited_at = limited_at;

        // Save the changes
        const updatedGroup = await this.groupRepository.save(groupToUpdate);

        return response.json(updatedGroup);
    }

//Delete group
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let groupToRemove = await this.groupRepository.findOneBy({ id })

        if (!groupToRemove) {
            return "this group not exist"
        }

        await this.groupRepository.remove(groupToRemove)

        return "group has been removed"
    }

}