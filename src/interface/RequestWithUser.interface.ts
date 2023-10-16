import { Request } from "express";

export interface RequestWithUser extends Request {
  user: {
    user_id: string,
    nickname: string,
    email: string
  },
  refreshToken: string
}