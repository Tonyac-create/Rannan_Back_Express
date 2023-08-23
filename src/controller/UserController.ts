import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { nickname, password, email, avatar_id } = request.body;
    
        const user = this.userRepository.create({
            nickname,
            password,
            email,
            avatar_id
        });
    
        const savedUser = await this.userRepository.save(user);
    
        return response.status(201).json(savedUser);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { nickname, password, email, avatar_id } = request.body;

        // Trouver l'utilisateur à mettre à jour
        const userToUpdate = await this.userRepository.findOneBy({ id })

        if (!userToUpdate) {
            return response.status(404).json({ error: "User not found" });
        }

        // Mettre à jour les champs
        userToUpdate.nickname = nickname;
        userToUpdate.password = password;
        userToUpdate.email = email;
        userToUpdate.avatar_id = avatar_id;

        // Enregistrer les modifications
        const updatedUser = await this.userRepository.save(userToUpdate);

        return response.json(updatedUser);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}