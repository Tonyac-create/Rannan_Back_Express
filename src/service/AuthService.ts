import jwt from "jsonwebtoken"
import { UserService } from "./UserService"

export class AuthService {

  private userService = new UserService()

  createToken(user_id: number, email: string) {
    let date = new Date()
    return jwt.sign( 
      {user_id, email, date},
      process.env.SECRET_KEY, 
      {
        expiresIn: "4w"
      }
    )
  }

  createRefreshToken(user_id: number, email: string) {
    let date = new Date()
    return jwt.sign( 
      {user_id, email, date},
      process.env.SECRET_KEY_REFRESH, 
      {
        expiresIn: "4w"
      }
    )
  }

  async tokenFunctions(user_id: number, email: string) {
    const token = await this.createToken(user_id, email)
    const refreshToken = await this.createRefreshToken(user_id, email)
    const updatedUser = await this.userService.update(user_id, {refreshToken})
    const user = {nickname: updatedUser.nickname, avatar_id: updatedUser.avatar_id}
    return {user, token, refreshToken}
  }

}