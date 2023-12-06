import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"



function __extractTokenFromHeader(request: Request) {
  // Split du préfixe et du token
  const [type, token] = request.headers.authorization.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

export async function jwtMiddleware(request: Request, response: Response, next: NextFunction) {
  try {

    if (request.url == "/auth/refreshToken") return next();

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

    // Ajout tu token dans la valeur 'user' de la request
    request['user'] = payload
    next()

  } catch (error) {
    response.status(401).json({ error: error.message, date: new Date() })
  }
}