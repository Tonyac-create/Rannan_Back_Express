import { User } from "../entity/User";

export interface UserCreateInterface extends User {
    nickname: string,
    password: string,
    email: string,
    avatar_id: number
}
