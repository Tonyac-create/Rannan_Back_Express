import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService"
import { ResponseMaker } from "../utils/ResponseMaker"
import { RequestWithUser } from "../interface/RequestWithUser.interface"
import { ContactService } from "../service/ContactService"
import { ValidationService } from "../service/ValidationService"
import { publishMessage } from "../utils/nats-config"
import jwt from "jsonwebtoken"
const bcrypt = require('bcrypt')

export class UserController {

// Services
    private userService = new UserService();
    private contactService = new ContactService();
    private validationService = new ValidationService();
    private responseMaker = new ResponseMaker();

// Vérifier la connection d'un user
    async userConnected(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
            const connectedUser = {
                email: user.email,
                id: user.id,
                validation: user.validation
            }
        // Réponse
            return this.responseMaker.responseSuccess(200, "Connected user informations.", connectedUser);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

    async checkPassword(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            const password = request.body.password;
            if (password === undefined) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
        // Vérification du mot de passe
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (!isPasswordMatched) {
                throw { status: 400, message: "Password not matched" }
            };
            return this.responseMaker.responseSuccess(200, "Password Match");
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Vérification d'email + Envoi d'un mail pour reset password
    async resetPassword(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body.email) {
                throw { status: 400, message: "Received informations not complet" }
            };
            const email = request.body.email
        // Vérification de l'email
            const emailExist = await this.userService.findOne("email", email, false);
            if (!emailExist) {
                throw { status: 404, message: "Email not found" }
            };
        // Récupération et préparation des informations pour le MS mailing
        // Récupération du nickname du user
            const nickname = emailExist.nickname
        // Création d'un token unique pour l'url
            const getToken = jwt.sign( 
                emailExist.id,
                process.env.SECRET_KEY_MAIL
            );
            const token = getToken.substr(0,10)
        // envoi des datas au MS mailing
            await publishMessage("resetMail", {email: email, nickname: nickname, token: token})

        // Réponse
            return this.responseMaker.responseSuccess(200, "Validation mail send", token);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Traiter le retour depuis un mail de demande de reset de mot de passe
    async returnResetPassword(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Récupération du user
            const userToUpdate = await this.userService.findOne("email", request.body.email, false);
            if (!userToUpdate) {
                throw { status: 404, message: "User not found" }
            };
        // update du user
            await this.userService.updatePassword(userToUpdate.id, request.body.newPassword);
        // Réponse
            return this.responseMaker.responseSuccess(200, 'Password updated');
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Mettre a jour un user par son id
    async updateUser(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.password || !request.body.update || request.body.update.password) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // Récupération du user
            const userToUpdate = await this.userService.findOne("id", request.user.user_id, false);
            if (!userToUpdate) {
                throw { status: 404, message: "User not found" }
            };
        // Vérification du mot de passe
            const isPasswordMatched = await bcrypt.compare(request.body.password, userToUpdate.password);
            if (!isPasswordMatched) {
                throw { status: 400, message: "Password not matched" }
            };
        // update du user
            await this.userService.update(userToUpdate.id, request.body.update);
        // Réponse
            return this.responseMaker.responseSuccess(200, 'User updated');
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Mettre a jour un user par son id
    async updatePassword(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.password || !request.body.update.newpassword) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // Récupération du user
            const user = await this.userService.findOne("id", request.user.user_id, false);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
        // Vérification du mot de passe
            const isPasswordMatched = await bcrypt.compare(request.body.password, user.password);
            if (!isPasswordMatched) {
                throw { status: 400, message: "Password not matched" }
            };
        // update du user
            await this.userService.updatePassword(user.id, request.body.update.newpassword);
        // Réponse
            return this.responseMaker.responseSuccess(200, 'User password updated');
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Récupération de l'avatar & nickname d'un user
    async getProfile(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de l'existance du user
            const user = await this.userService.findOne("id", +request.params.id, false);
            if (!user) {
                throw { status: 404, message: "User not found" }
            };
        // Réponse
            return this.responseMaker.responseSuccess(200, 'User profile found', {avatar_id: user.avatar_id, nickname: user.nickname});
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Récupération d'un user dont le nickname est similaire a la request
    async userSearch(request: Request, response: Response, next: NextFunction) {
        try {
        // Vérification de la présence des champs requis
            if (!request.body || !request.body.search) {
                throw { status: 400, message: "Received informations not complet" }
            };
        // Recherche d'un user au nickname similaire a la recherche
            const search = request.body.search;
            const users = await this.userService.searchOne(search);
            if (!users || users.length <= 0) {
                return "No user found"
            };
        // Réponse
            return this.responseMaker.responseSuccess(200, 'Users found', users);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Supprimer un user par son id
    async removeUser(request: RequestWithUser, response: Response, next: NextFunction) {
        try {
        // Récupération du user
            const userToDelete = await this.userService.findOne("id", request.user.user_id, true);
        // suppression du user par sont id
            await this.userService.remove(userToDelete);
        // Réponse
            return this.responseMaker.responseSuccess(200, `User has been deleted`);
        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }

// Récupérer la relation(contact, validation, rien) avec un user
    async getUserRelation(request: RequestWithUser, response: Response, next: NextFunction){
        try{
            //Variables
            let relation_type;
            let relation_id;

            //Récupération des users
            const currentUserId = parseInt(request.user.user_id);
            const otherUserId = parseInt(request.params.id);

            //Vérifier que currentUserId dfférent de otherUserId
            if(currentUserId === otherUserId){
                throw { status: 400, message: "User1 and User2 are the same user" }
            };

            //Vérifier si les users sont en contact
            const testContact = await this.contactService.oneByUsers(currentUserId, otherUserId);
            if(testContact){
                relation_type = "contact";
                relation_id = testContact.id
            };

            //Vérifier si les users ont une validation
            const testValidation = await this.validationService.oneByUsers(currentUserId, otherUserId);
            if(testValidation){
                relation_type = "validation";
                relation_id = testValidation.id;
            }

            //dans le cas où il n'y aie rien
            if(!testContact && !testValidation ){
                throw { status: 400, message: "No relations found" }
            }

            //Réponse
            const relation = {relation_type, relation_id}
            return this.responseMaker.responseSuccess(200, "Relation found", relation)

        } catch (error) {
            if (error.status && error.message) {
                response.status(error.status).json({error :error.message, date : new Date()})
            } else {
                response.status(500).json({error :error.message, date : new Date()})
            }
        }
    }
}