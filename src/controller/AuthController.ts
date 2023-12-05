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
        throw new Error("Email already used")
      };
    // Hash  le mot de passe
      request.body.password = await bcrypt.hash(request.body.password, 10);
    // Créer le user dans la db
      const user = await this.userService.saveUser(request.body);
    // Créer un token
      const resToken = await this.authService.createToken(user.id, user.email)
    // Création du token de validation
      const validationToken = resToken.substr(0,10)
    // Envoi du mail de validation
      await publishMessage("validationMail", {email: user.email, nickname: user.nickname, token: validationToken})
    // Réponse
      return this.responseMaker.responseSuccess(201, 'Account created', validationToken);

    } catch (error) {
      response.status(500).json({ error: error.message, date: new Date() })
    }
  }

  async returnValidation(request: Request, response: Response, next: NextFunction) {
    try {
      console.log("returnValidation body :", request.body)
      const user = await this.userService.findOne("email", request.body.email, false)
      if (!user ) {
        throw new Error("User not found")
      }
      user.validation = true
      await this.userService.update(user.id, user)
      return this.responseMaker.responseSuccess(201, 'Account validated');
    } catch (error) {
      response.status(500).json({ error: error.message, date: new Date() })
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      // Vérifie si l'email enregistré correspond a un email enregistré
      const user = await this.userService.findOne("email", request.body.email, false)
      if (!user) {
        throw new Error("User not found")
      }
      //Vérifie si le mot de passe renseigné correspond a celui enregistré
      const isPasswordMatched = await bcrypt.compare(request.body.password, user.password)
      if (!isPasswordMatched) {
        throw new Error("Unauthotized (password not matched)")
      }

      // Créer les Token & refreshToken et les enregistrements
      return await this.authService.tokenFunctions(user.id, user.email)

    } catch (error) {
      response.status(500).json({ error: error.message, date: new Date() })
    }
  }

  async disconnect(request: RequestWithUser, response: Response, next: NextFunction) {
    try {
      const user = await this.userService.findOne("id", request.user.user_id, false)
      if (!user) {
        throw new Error("User not find")
      }
      user.refreshToken = null

      //TODO: mettre à jour l'object user après modification
      return "User Disconnect"

    } catch (error) {
      response.status(500).json({ error: error.message, date: new Date() })
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
      response.status(500).json({ error: error.message, date: new Date() })
    }
  }

}