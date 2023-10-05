import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"

export class UserController {

// Services
    private userService = new UserService()

// Récupération de tout les users
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.userService.all()
        } 
        catch (error) {
        console.log("🐼 ~ file: UserController.ts:14 ~ all ~ error:", error)
        }
    }

// Récupération d'un user par son id
    async one(request: Request, response: Response, next: NextFunction) {
        try {
        // Chercher un user par son id
            const user = await this.userService.findOne("id", +request.params.id)
        // SI l'id n'est pas trouvé
            if (!user) {
                return {
                    success: `ko`,
                    message: `user not found`
                }
            }
        // SI l'id est trouvé
            return user
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:33 ~ one ~ error:", error)
        }
    }

// Enregistrer un nouveau user
    async save(request: Request, response: Response, next: NextFunction) {
        try {
        // Chercher un user par son mail
            const user = await this.userService.findOne("email", request.body.email)
        // SI le mail existe déja
            if (user) {
                return {
                    success: `ko`,
                    message: `email ${user.email} already used`
                }
            }
            // IF mail does not exist
            return await this.userService.create(request.body)
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:52 ~ save ~ error:", error)
        }
    }

// Mettre a jour un user par son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.findOne("id", +request.params.id)
            // IF user not found
            if (!user) {
                return {
                    success: 'ko',
                    message: 'user not found'
                }
            }
            // IF user is found
            return this.userService.update(user.id, request.body)
        } catch (error) {
            console.log("🐼 ~ file: UserController.ts:71 ~ update ~ error:", error)
        }
    }

// Supprimer un user par son id
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.findOne("id", +request.params.id)
            // IF user not found
            if (!user) {
                return {
                    success: `ko`,
                    message: `user not found`
                }
            }
            // IF user is found
            const userName = user.nickname
            await this.userService.remove(+request.params.id)
            return {
                success: `ok`,
                message: `user '${userName}' was deleted`
            }
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:95 ~ remove ~ error:", error)
        }
    }
}
