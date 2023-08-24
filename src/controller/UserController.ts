import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"

export class UserController {

    
    private userService = new UserService()

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.userService.all()
        } 
        catch (error) {
            console.log("🐼UserController ~ all ~ error:", error)
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const user = await this.userService.one(+request.params.id)
            if (user) { return user }
            return {
                success: `ko`,
                message: `user not found`
            }
        } catch (error) {
            console.log("🐼UserController ~ one ~ error:", error)
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
//? appel d'une fonction qui cherche un user selon son email 
            // Check if email is already used
            const user = await this.userService.oneByMail(request.body)
            // IF email not exist
            if (!user) {
                return await this.userService.create(request.body)
            }

//? si on obtiens un résultat on sort de la fonction
            return {
                success: `ko`,
                message: `email ${user.email} already used`
            }
        } catch (error) {
            console.log("🐼UserController ~ save ~ error:", error)
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get by id l'user 
            const user = await this.userService.one(+request.params.id)
            if (user) {
                await this.userService.remove(+request.params.id)
                return {
                    success: `ko`,
                    message: `user '${user.nickname}' was deleted`
                }
            }
            return {
                success: `ko`,
                message: `user not found`
            }
        } catch (error) {
            console.log("🐼UserController ~ remove ~ error:", error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const user = await this.userService.one(+request.params.id)
            if (user) {
                return this.userService.update(user, request.body); // Appel avec un seul argument
            }
            return {
                success: 'ko',
                message: 'user not found'
            }
        } catch (error) {
            console.log("🐼UserController ~ update ~ error:", error);
            response.status(500).json({ error: "An error occurred while updating user" });
        }
    }

}
