// import { AppDataSource } from "../data-source"
// import { NextFunction, Request, Response } from "express"
// import { User } from "../entity/User"
// import { UserService } from "../service/UserService"

// export class UserController {

//     private userRepository = AppDataSource.getRepository(User)
//     private userService = new UserService()

//     async all(request: Request, response: Response, next: NextFunction) {
//         return this.userRepository.find()
//     }

//     async one(request: Request, response: Response, next: NextFunction) {
//         const id = parseInt(request.params.id)


//         const user = await this.userRepository.findOne({
//             where: { id }
//         })

//         if (!user) {
//             return "unregistered user"
//         }
//         return user
//     }

//     async save(request: Request, response: Response, next: NextFunction) {
//         try {
//             const { nickname, password, email, avatar_id } = request.body;
//             const user = await this.userService.create({ nickname, password, email, avatar_id })
//             return user;
            
//         } catch (error) {
//             console.log("error", error)
//         }
//     }

//     async remove(request: Request, response: Response, next: NextFunction) {
//         const id = parseInt(request.params.id)

//         let userToRemove = await this.userRepository.findOneBy({ id })

//         if (!userToRemove) {
//             return "this user not exist"
//         }

//         await this.userRepository.remove(userToRemove)

//         return "user has been removed"
//     }

//     async update(request: Request, response: Response, next: NextFunction) {
        
//         const id = +request.params.id

//         const updateUser = await this.userRepository.findOne({ where: { id } })

//         this.userRepository.merge(updateUser, request.body);
//         await this.userRepository.save(updateUser);
//         return updateUser
//       };

// }
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
            return await this.userService.create(request.body)
        } catch (error) {
            console.log("🐼UserController ~ save ~ error:", error)
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.userService.remove(+request.params.id)
        } catch (error) {
            console.log("🐼UserController ~ remove ~ error:", error)
        }
    }
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const id = +request.params.id;
            const updatedUser = await this.userService.update(id); // Appel avec un seul argument
            return updatedUser;
        } catch (error) {
            console.log("🐼UserController ~ update ~ error:", error);
            response.status(500).json({ error: "An error occurred while updating user" });
        }
    }


}
