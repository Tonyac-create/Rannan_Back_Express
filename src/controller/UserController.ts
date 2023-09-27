import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"

export class UserController {

    private userService = new UserService()

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.userService.all()
        } 
        catch (error) {
        console.log("🐼 ~ file: UserController.ts:13 ~ all ~ error:", error)
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.oneById(+request.params.id)
            if (user) { return user }

            // IF user not found
            return {
                success: `ko`,
                message: `user not found`
            }
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:28 ~ one ~ error:", error)
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by mail
            const user = await this.userService.oneByMail(request.body)
            if (!user) {
                // call create service
                return await this.userService.create(request.body)
            }

            // IF user already has this email
            return {
                success: `ko`,
                message: `email ${user.email} already used`
            }
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:48 ~ save ~ error:", error)
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.oneById(+request.params.id)
            if (user) {
                // call remove service
                await this.userService.remove(+request.params.id)
                return {
                    success: `ko`,
                    message: `user '${user.nickname}' was deleted`
                }
            }

            // IF not found user
            return {
                success: `ko`,
                message: `user not found`
            }
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:71 ~ remove ~ error:", error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.oneById(+request.params.id)
            if (user) {
                // call update service
                return this.userService.update(user, request.body);
            }
            // IF not found user
            return {
                success: 'ko',
                message: 'user not found'
            }
        } catch (error) {
            console.log("🐼 ~ file: UserController.ts:89 ~ update ~ error:", error)
            response.status(500).json({ error: "An error occurred while updating user" });
        }
    }

}
