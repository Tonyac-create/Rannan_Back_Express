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
        expiresIn: "1w"
      }
    )
  }

  createRefreshToken(user_id: number, email: string) {
    let date = new Date()
    return jwt.sign( 
      {user_id, email, date},
      process.env.SECRET_KEY_REFRESH, 
      {
        expiresIn: "3w"
      }
    )
  }

  async tokenFunctions(user_id: number, email: string) {
    const token = await this.createToken(user_id, email)
    const refreshToken = await this.createRefreshToken(user_id, email)
    await this.userService.update(user_id, {refreshToken: refreshToken})
    const updatedUser = await this.userService.findOne("id", user_id, false)
    const user = {
      id: updatedUser.id,
      nickname: updatedUser.nickname,
      email: updatedUser.email,
      avatar_id: updatedUser.avatar_id
    }
    return {user, token, refreshToken}
  }

}