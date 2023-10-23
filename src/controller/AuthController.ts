import { NextFunction, Request, Response } from "express"
import { UserService } from "../service/UserService";
import { AuthService } from "../service/AuthService";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
const bcrypt = require('bcrypt')

export class AuthController {

  private userService = new UserService()
  private authService = new AuthService()

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      // Vérifie si l'email envoyé correspond a un email enregistré
      const userAlreadyExist = await this.userService.findOne("email", request.body.email, false)
      if (userAlreadyExist) {
        throw new Error("Email already used")
      }
      // Hash  le mot de passe
      request.body.password = await bcrypt.hash(request.body.password, 10)
      // Créer le user dans la db
      const user = await this.userService.saveUser(request.body)

      // Créer les Token & refreshToken et les enregistrements
      return await this.authService.tokenFunctions(user.id, user.email)

    } catch (error) {
      response.status(500).json({error :error.message, date : new Date()})
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      // Vérifie si l'email enregistré correspond a un email enregistré
      const user = await this.userService.findOne("email", request.body.email, false)
      if (!user) {
        throw new Error("User not find")
      }
      //Vérifie si le mot de passe renseigné correspond a celui enregistré
      const isPasswordMatched = await bcrypt.compare(request.body.password, user.password)
      if (!isPasswordMatched) {
        throw new Error("Unauthotized (password not matched)")
      }

      // Créer les Token & refreshToken et les enregistrements
      return await this.authService.tokenFunctions(user.id, user.email)

    } catch (error) {
      response.status(500).json({error :error.message, date : new Date()})
    }
  }

  async disconnect(request: RequestWithUser, response: Response, next: NextFunction) {
    try {
      const user = await this.userService.findOne("email", request.user.email, false)
      if (!user) {
        throw new Error("User not find")
      }
      user.refreshToken = null

      return "User Disconnect"

    } catch (error) {
      response.status(500).json({error :error.message, date : new Date()})
    }
  }

  async refreshToken(request: RequestWithUser, response: Response, next: NextFunction) {
    try {
      // Vérifie si l'email enregistré correspond a un email enregistré
      const user = await this.userService.findOne("email", request.user.email, false)
      if (!user) {
        throw new Error("user not found")
      } else 
      // Vérifie si le refreshToken du user est le meme que celui en db
      if (user.refreshToken !== request.refreshToken) {
        throw new Error("refresh token not admit")
      }

      // Recréer les Token & refreshToken
      return await this.authService.tokenFunctions(user.id, user.email)

    } catch (error) {
      response.status(500).json({error :error.message, date : new Date()})
    }
  }

}