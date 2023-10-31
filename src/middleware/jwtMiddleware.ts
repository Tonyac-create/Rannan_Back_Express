import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

function __extractTokenFromHeader(request: Request) {
// Split du préfixe et du token
  const [ type, token ] = request.headers.authorization.split(' ') ?? []
  return type === 'Bearer' ? token: undefined
} 

export async function jwtMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    
// Vérification de la présence d'une authorisation (Token)
    if (!request.headers.authorization) {
      throw new Error("Authorization Undefined")
    }
// Récupération du Token du header
    const token = __extractTokenFromHeader(request)
    if (!token) {
      throw new Error("Token Undefined")
    }

// Vérification du Token
    const payload = jwt.verify(token, process.env.SECRET_KEY)

// Vérification de l'existence du user qui envoi le token
    const user = this.UserService.findOne("id", payload.user_id, false)
    if (user.email !== payload.email) {
      throw new Error("Token user.id not exist")
    }

// Ajout tu token dans la valeur 'user' de la request
    request['user'] = payload
    next()

  } catch (error) {
    response.status(500).json({error :error.message, date : new Date()})
  }
}