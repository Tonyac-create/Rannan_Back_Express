import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"
import { ResponseMaker } from "../utils/ResponseMaker"

export class UserController {

// Services
    private userService = new UserService()
    private responseMaker = new ResponseMaker()

// Récupération de tout les users
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const users = await this.userService.all()
            return this.responseMaker.responseSuccess(`All users`, users)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Récupération d'un user par son id
    async one(request: Request, response: Response, next: NextFunction) {
        try {
        // Chercher un user par son id
            const user = await this.userService.findOne("id", +request.params.id, false)
        // SI l'id n'est pas trouvé
            if (!user) {
                throw new Error("L'utilisateur n'a pas été trouvé")
            }
        // SI l'id est trouvé
            return this.responseMaker.responseSuccess(`User id: ${user.id}`, user)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Enregistrer un nouveau user
    async save(request: Request, response: Response, next: NextFunction) {
        try {
        // Chercher un user par son mail
            const user = await this.userService.findOne("email", request.body.email, false)
        // SI le mail existe déja
            if (user) {
                throw new Error(`Email ${user.email} already used`)
            }
            // IF mail does not exist
            const newUser = await this.userService.saveUser(request.body)
            return this.responseMaker.responseSuccess(`New user id: ${newUser.id}`, newUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Mettre a jour un user par son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.findOne("id", +request.params.id, false)
            // IF user not found
            if (!user) {
                throw new Error("User not found")
            }
            // IF user is found
            const updatedUser = await this.userService.update(user.id, request.body)
            return this.responseMaker.responseSuccess('User updated successfully', updatedUser)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }

// Supprimer un user par son id
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.findOne("id", +request.params.id, false)
            // IF user not found
            if (!user) {
                throw new Error ("User not found")
            }
            // IF user is found
            const userName = user.nickname
            await this.userService.remove(+request.params.id)
            return this.responseMaker.responseSuccess(`User ${userName} has been deleted`, user)
        } catch (error) {
            response.status(500).json({ error: error.message })
        }
    }
}
