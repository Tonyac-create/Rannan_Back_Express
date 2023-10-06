import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"

export class UserController {

// Services
    private userService = new UserService()

// Récupération de tout les users
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const users = await this.userService.all()
            return response.json(users)
        } catch (error) {
            response.status(400).send(`UserController.all ERROR: ${error}`)
        }
    }

// Récupération d'un user par son id
    async one(request: Request, response: Response, next: NextFunction) {
        try {
        // Chercher un user par son id
            const user = await this.userService.findOne("id", +request.params.id)
        // SI l'id n'est pas trouvé
            if (!user) {
                return response.status(400).send("User not found")
            }
        // SI l'id est trouvé
            return response.json(user)
        } catch (error) {
            response.status(400).send(`UserController.one ERROR: ${error}`)
        }
    }

// Enregistrer un nouveau user
    async save(request: Request, response: Response, next: NextFunction) {
        try {
        // Chercher un user par son mail
            const user = await this.userService.findOne("email", request.body.email)
        // SI le mail existe déja
            if (user) {
                response.status(400).send(`Email ${user.email} already used`)
            }
            // IF mail does not exist
            const newUser = await this.userService.create(request.body)
            return response.json(newUser)
        } catch (error) {
            response.status(400).send(`UserController.save ERROR: ${error}`)
        }
    }

// Mettre a jour un user par son id
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.findOne("id", +request.params.id)
            // IF user not found
            if (!user) {
                return response.status(400).send("User not found")
            }
            // IF user is found
            await this.userService.update(user.id, request.body)
            return response.status(200).send('User updated successfully')
        } catch (error) {
            response.status(400).send("UserController.update ERROR :").send(error)
        }
    }

// Supprimer un user par son id
    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get user by id
            const user = await this.userService.findOne("id", +request.params.id)
            // IF user not found
            if (!user) {
                return response.status(400).send("User not found")
            }
            // IF user is found
            const userName = user.nickname
            await this.userService.remove(+request.params.id)
            return response.status(200).send(`User ${userName} has been deleted`)
        } catch (error) {
            response.status(400).send("UserController.remove ERROR :").send(error)
        }
    }
}
