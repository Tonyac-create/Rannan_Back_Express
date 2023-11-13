import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { RequestWithUser } from "../interface/RequestWithUser.interface"
const bcrypt = require('bcrypt')

export class UserController {

// Services
    private userService = new UserService()
    private responseMaker = new ResponseMaker()

// Vérifier la connection d'un user
    async userConnected(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
        // Réponse
            return this.responseMaker.responseSuccess(200, "Connected user informations.", request.user)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Envoyer l'email de l'utilisateur
    async getEmail(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
        // Réponse
            return this.responseMaker.responseSuccess(200, "User email", request.user.email)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Vérification d'email + Envoi d'un mail pour reset password
    async resetPassword(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body.email) {
                throw new Error("Received informations not complet")
            }
        // Vérification de l'email
            const emailExist = await this.userService.findOne("id", request.body.email, false)
            if (!emailExist) {
                throw new Error("Email not found")
            }

        //! A AJOUTER => MS mailing


        // Réponse
            return this.responseMaker.responseSuccess(200, "Validation mail send", request.body.email)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Mettre a jour un user par son id
    async updateUser(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.password || !request.body.update || request.body.update.password) {
                throw new Error("Received informations not complet or correct")
            }
        // Récupération du user
            const userToUpdate = await this.userService.findOne("id", request.user.user_id, false)
            if (!userToUpdate) {
                throw new Error("User not found")
            }
        // Vérification du mot de passe
            const isPasswordMatched = await bcrypt.compare(request.body.password, userToUpdate.password)
            if (!isPasswordMatched) {
                throw new Error("Password not matched)")
            }
        // update et return du user
            const user = await this.userService.update(userToUpdate.id, request.body.update)
        // Réponse
            return this.responseMaker.responseSuccess(200, 'User updated', user)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Mettre a jour un user par son id
    async updatePassword(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.password || !request.body.newpassword) {
                throw new Error("Received informations not complet")
            }
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
        // Vérification du mot de passe
            const isPasswordMatched = await bcrypt.compare(request.body.password, user.password)
            if (!isPasswordMatched) {
                throw new Error("Unauthotized (password not matched)")
            }
        // update et return du user
            const updatedUser = await this.userService.updatePassword(user.id, request.body.newpassword)
        // Réponse
            return this.responseMaker.responseSuccess(200, 'User password updated', updatedUser)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Récupération de l'avatar & nickname d'un user
    async getProfile(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.params.id) {
                throw new Error("Received informations not complet")
            }
        // Vérification de l'existance du user
            const user = await this.userService.findOne("id", +request.params.id, false)
            if (!user) {
                throw new Error ("User not found")
            }
        // Réponse
            return this.responseMaker.responseSuccess(200, 'User profile found', {avatar_id: user.avatar_id, nickname: user.nickname})
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Récupération d'un user dont le nickname est similaire a la request
    async userSearch(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.search) {
                throw new Error("Received informations not complet")
            }
        // Recherche d'un user au nickname similaire a la recherche
            const search = request.body.search
            const users = await this.userService.searchOne(search)
            if (!users || users.length <= 0) {
                return "No user found"
            }
        // Réponse
            return this.responseMaker.responseSuccess(200, 'Users found', users)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }

// Supprimer un user par son id
    async removeUser(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.password) {
                throw new Error("Received informations not complet")
            }
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false)
            if (!user) {
                throw new Error("User not found")
            }
        // Vérification du mot de passe
            const isPasswordMatched = await bcrypt.compare(request.body.password, user.password)
            if (!isPasswordMatched) {
                throw new Error("Password not matched)")
            }
        // suppression du user par sont id
            await this.userService.remove(user.id)
        // Réponse
            return this.responseMaker.responseSuccess(200, `User has been deleted`)
        } catch (error) {
            return this.responseMaker.responseError(500, error.message)
        }
    }
}