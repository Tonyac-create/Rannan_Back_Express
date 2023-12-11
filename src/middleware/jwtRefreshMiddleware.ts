import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

function __extractTokenFromHeader(request: Request) {
  // Split du préfixe et du token
  const [type, token] = request.headers.authorization.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

export async function jwtRefreshMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    // Vérification de la présence d'une authorisation (refreshToken)
    if (!request.headers.authorization) {
      throw { status: 404, message: "Authorization Undefined" }
    }
    // Récupération du Token du header
    const refreshToken = __extractTokenFromHeader(request)
    if (!refreshToken) {
      throw { status: 404, message: "Token Undefined" }
    }

    // Vérification du Token
    const payload = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH)

    // Ajout tu token dans la valeur 'user' de la request
    request['user'] = payload
    // Ajout tu refreshToken dans la valeur 'refreshToken' de la request
    request['refreshToken'] = refreshToken
    next()

  } catch (error) {
    if (error.status && error.message) {
      response.status(error.status).json({error :error.message, date : new Date()})
    } else {
      response.status(500).json({error :error.message, date : new Date()})
    }
  }
}