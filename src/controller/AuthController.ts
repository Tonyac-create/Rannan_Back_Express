import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService";
import { AuthService } from "../service/AuthService";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { ResponseMaker } from "../utils/ResponseMaker"
import { publishMessage } from "../utils/nats-config";
const bcrypt = require('bcrypt')

export class AuthController {

  private userService = new UserService()
  private authService = new AuthService()
  private responseMaker = new ResponseMaker();

  async register(request: Request, response: Response, next: NextFunction): Promise<{}> {
    try {
    // Vérifie si l'email envoyé correspond a un email enregistré
      const userAlreadyExist = await this.userService.findOne("email", request.body.email, false);
      if (userAlreadyExist) {
        throw { status: 409, message: "Email already used" }
      };
    // Hash  le mot de passe
      request.body.password = await bcrypt.hash(request.body.password, 10);
    // Créer le user dans la db
      const user = await this.userService.saveUser(request.body);
    // Créer un token et découpe pour créer le token de validation
      const resToken = await this.authService.createToken(user.id, user.email)
      const validationToken = resToken.substr(0,10)
    // Envoi du mail de validation
      await publishMessage("validationMail", {email: user.email, nickname: user.nickname, token: validationToken})
    // Réponse
      return this.responseMaker.responseSuccess(201, 'Account created', validationToken);

    } catch (error) {
      if (error.status && error.message) {
        response.status(error.status).json({error :error.message, date : new Date()})
      } else {
        response.status(500).json({error :error.message, date : new Date()})
      }
    }
  }

  async returnValidation(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await this.userService.findOne("email", request.body.email, false)
      if (!user ) {
        throw { status: 404, message: "User not found" }
      }
      user.validation = true
      await this.userService.update(user.id, user)
      return this.responseMaker.responseSuccess(201, 'Account validated');
    } catch (error) {
      if (error.status && error.message) {
        response.status(error.status).json({error :error.message, date : new Date()})
      } else {
        response.status(500).json({error :error.message, date : new Date()})
      }
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      // Vérifie si l'email enregistré correspond a un email enregistré
      const user = await this.userService.findOne("email", request.body.email, false)
      if (!user) {
        throw { status: 404, message: "User not found" }
      }
      //Vérifie si le mot de passe renseigné correspond a celui enregistré
      const isPasswordMatched = await bcrypt.compare(request.body.password, user.password)
      if (!isPasswordMatched) {
        throw { status: 401, message: "Password not matched)" }
      }

      // Créer les Token & refreshToken et les enregistrements
      return await this.authService.tokenFunctions(user.id, user.email)

    } catch (error) {
      if (error.status && error.message) {
        response.status(error.status).json({error :error.message, date : new Date()})
      } else {
        response.status(500).json({error :error.message, date : new Date()})
      }
    }
  }

  async disconnect(request: RequestWithUser, response: Response, next: NextFunction) {
    try {
      const user = await this.userService.findOne("id", request.user.user_id, false)
      if (!user) {
        throw { status: 404, message: "User not found" }
      }
      await this.userService.update(user.id, {refreshToken: null})
      // Retour
      return "User Disconnect"
    } catch (error) {
      if (error.status && error.message) {
        response.status(error.status).json({error :error.message, date : new Date()})
      } else {
        response.status(500).json({error :error.message, date : new Date()})
      }
    }
  }

  async refreshToken(request: RequestWithUser, response: Response, next: NextFunction) {
    try {
      // Vérifie si l'email enregistré correspond a un email enregistré
      const user = await this.userService.findOne("email", request.body.email, false)
      if (!user) {
        throw { status: 404, message: "User not found" }
      } else
      // Vérifie si le refreshToken du user est le meme que celui en db
      if (user.refreshToken !== request.refreshToken) {
        throw { status: 401, message: "refresh token not admit" }
      }

      // Génére une nouvelle paire de token
      const newToken = await this.authService.createToken(user.id, user.email)
      const newRefreshToken = await this.authService.createRefreshToken(user.id, user.email)

      // Save le Refresh Token dans le user en db
      await this.userService.update(user.id, {refreshToken: newRefreshToken})

      //* Test de différence entre l'ancien et le nouveau token OK
      // console.log("AuthController- refreshToken - user :", user)
      // console.log("AuthController- refreshToken - updatedUser :", await this.userService.findOne("id", user.id, false))

      // Renvoi la nouvelle paire de Token
      return this.responseMaker.responseSuccess(201, "JWT Refresh Success", {authToken: newToken, authRefreshToken: newRefreshToken});
    } catch (error) {
      if (error.status && error.message) {
        response.status(error.status).json({error :error.message, date : new Date()})
      } else {
        response.status(500).json({error :error.message, date : new Date()})
      }
    }
  }

}