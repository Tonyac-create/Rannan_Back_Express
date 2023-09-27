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
            return await this.userService.one(+request.params.id)
        } catch (error) {
            console.log("🐼UserController ~ one ~ error:", error)
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            
            // appel d'une fonction qui cherche un user selon son email 
            //si on obiten un résultat on sort de la fonction

            return await this.userService.create(request.body)
        } catch (error) {
            console.log("🐼UserController ~ save ~ error:", error)
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            // get by id l'user 
            // const user = await this.userService.one(id)

            // si ! user je sors
            return await this.userService.remove(+request.params.id)
        } catch (error) {
            console.log("🐼UserController ~ remove ~ error:", error)
        }
    }
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            const updatedUser = await this.userService.update(id, request.body); // Appel avec un seul argument
            return updatedUser;
        } catch (error) {
            console.log("🐼UserController ~ update ~ error:", error);
            response.status(500).json({ error: "An error occurred while updating user" });
        }
    }


}
