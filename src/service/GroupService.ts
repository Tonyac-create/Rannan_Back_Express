import { AppDataSource } from "../data-source"
import { Group } from "../entity/Group"
import { User } from "../entity/User"
import { GroupCreateInterface } from "../interface/GroupCreateInterface"
import { UserService } from "./UserService"

export class GroupService {

    private groupRepository = AppDataSource.getRepository(Group);
    private userService = new UserService();

    async allGroupsBy(field: string, value: number): Promise<Object[]> {
        // Trouve les groupes suivant les valeurs de champs (value of field) renseigné
            const groups = await this.groupRepository.find({where: {[field]: value}});
            if (!groups || groups.length === 0) {
                throw new Error("No groups found with specified creator")
            };
        // Filtre le renvoi des informations des groups
            const groupsFound = groups.map((group: Group) => {
                const { name, id, limited_at, creator_id } = group
                return { name, id, limited_at, creator_id }
            });
        // Réponse
            return groupsFound;
    }

    async saveGroup(body: any, creator_id: number): Promise< Group > {
        // Défini les valeurs de champs du nouveau groupe
            const newGroup = {
                name: body.name,
                limited_at: new Date(body.limited_at),
                creator_id: creator_id
            };
        // Réponse
            return await this.groupRepository.save(newGroup);
    }

    async updateGroup(group: Group, body: GroupCreateInterface): Promise<string | undefined> {
        // Met a jour le groupe
            const groupToUpdate = await this.groupRepository.update(group.id, body);
        // Vérifie si une mise a jour a été executé
            if (groupToUpdate.affected === 0) {
                throw new Error("Group not updated")
            };
        // Réponse
            return `Group ${group.name} has updated`;
    }

    async removeGroup(id: number): Promise< Group > {
        // Trouve le group a supprimer
            const group = await this.groupRepository.findOneBy({ id: id });
            if (!group) {
                throw new Error("Group not found")
            };
        // Supprime le groupe
            await this.groupRepository.remove(group);
        // Réponse
            return group;
    }

    async allUserGroups(user_id: number): Promise<Object[] | undefined> {
        // Cherche le user défini
            const user = await this.userService.findOne("id", user_id, true);
            if (!user) {
                throw new Error("User not found")
            };
        // Filtre le renvoi des informations des groups
            const userGroups = user.groups.map(group => {
                const { name, id, limited_at, creator_id } = group
                return { name, id, limited_at, creator_id }
            });
        // Réponse
            return userGroups;
    }

    async addUserToGroup(user: User, group: Group): Promise<string> {
        // Vérifie si le groupe existe ou pas dans la liste des groupes du user
            user.groups.map((el) => {
                if (el.id === group.id) {
                    throw new Error("User already in group")
                }
            });
        // Ajoute le groupe a la liste des groupes du user
            user.groups.push(group);
        // Enregistre le user
            await this.userService.saveUser(user);
        // Réponse
            return `Utilisateur ${user.nickname} ajouté au groupe ${group.name}`;
    }

    async deleteUserToGroup(user: User, group_id: number): Promise<string> {
        // Trouve l'index du groupe dans le tableau des groupes du user
            const groupToDelete = user.groups.findIndex((group: Group) => group.id === group_id);
            if (groupToDelete === -1) {
                throw new Error("This user is not a member of this group")
            };
        // Retire le groupe du tableau des groupes du user
            const removedGroup = user.groups.splice(groupToDelete, 1)[0];
        // Enregistre le user
            await this.userService.saveUser(user);
        // Réponse
            return `Utilisateur ${user.nickname} retiré du groupe ${removedGroup.name}`;
    }

    async allGroupMember(groupId: number): Promise< Group > {
        // Réponse
            return this.groupRepository.findOne({
                where: { id: groupId },
                relations: ['users']
            });
    }

}