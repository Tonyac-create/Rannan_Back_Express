import jwt from "jsonwebtoken"
import { UserService } from "./UserService"

export class AuthService {

  private userService = new UserService()

  createToken(user_id: number, email: string) {
    let date = new Date()
    date.getHours()+3
    return jwt.sign( 
      {user_id, email, date},
      process.env.SECRET_KEY, 
      {
        expiresIn: "1w"
      }
    )
  }

  createRefreshToken(user_id: number, email: string) {
    let date = new Date()
    date.getDay()+7
    return jwt.sign( 
      {user_id, email, date},
      process.env.SECRET_KEY_REFRESH, 
      {
        expiresIn: "1w"
      }
    )
  }

  async tokenFunctions(user_id: number, email: string) {
    const token = await this.createToken(user_id, email)
    const refreshToken = await this.createRefreshToken(user_id, email)
    const user = await this.userService.update(user_id, {refreshToken})
    return {user, token, refreshToken}
  }

}