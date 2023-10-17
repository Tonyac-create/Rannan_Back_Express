import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { RequestWithUser } from "../interface/RequestWithUser.interface"

export class UserController {

// Services
    private userService = new UserService()
    private responseMaker = new ResponseMaker()

// Vérifier la connection d'un user
    async userConnected(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
            return {message: "Connected user informations :", user: request.user}
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Vérification d'email + Envoi d'un mail pour reset password
    async resetPassword(request: Request, response: Response, next: NextFunction) {
        try {
            const emailExist = await this.userService.findOne("email", request.body.email, false)
            if (!emailExist) {
                throw new Error("Email not found")
            }
        // A AJOUTER => MS mailing
            return "Reset mail send"
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Mettre a jour un user par son id
    async updateUser(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de l'existance du user
            const user = await this.userService.findOne("id", request.user.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
        // update et return du user
            const updatedUser = await this.userService.update(user.id, request.body)
            return this.responseMaker.responseSuccess('User updated successfully', updatedUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupération de l'avatar & nickname d'un user
    async getProfile(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de l'existance du user
            const user = await this.userService.findOne("id", +request.params.id, false)
            if (!user) {
                throw new Error ("User not found")
            }
        // return avatar_id et nickname
            return {avatar: user.avatar_id, nickname: user.nickname}
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

//! Récupération d'un user dont le nickname est similaire a la request


// Supprimer un user par son id
    async removeUser(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de l'existance du user
            const user = await this.userService.findOne("id", +request.params.id, false)
            if (!user) {
                throw new Error ("User not found")
            }
        // sauvegarde du nickname pour return
            const userName = user.nickname
        // suppression du user par sont id
            await this.userService.remove(+request.params.id)
            return this.responseMaker.responseSuccess(`User ${userName} has been deleted`, user)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

}