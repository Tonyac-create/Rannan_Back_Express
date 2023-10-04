import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"

export class UserController {

// Services
    private userService = new UserService()

// get All users
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.userService.all()
        } 
        catch (error) {
        console.log("🐼 ~ file: UserController.ts:14 ~ all ~ error:", error)
        }
    }

// get One user by id
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.oneById(+request.params.id)
            // IF user not found
            if (!user) {
                return {
                    success: `ko`,
                    message: `user not found`
                }
            }
            // IF user is found
            return user
        } catch (error) {
        console.log("🐼 ~ file: UserController.ts:33 ~ one ~ error:", error)
        }
    }

// Save a user
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by mail
            const user = await this.userService.oneByMail(request.body)
            // IF mail already has in db
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

// Update a user
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.oneById(+request.params.id)
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

// Remove a user
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.oneById(+request.params.id)
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
