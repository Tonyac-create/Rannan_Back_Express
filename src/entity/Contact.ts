import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    user1Id: User

    @ManyToOne(() => User, (user) => user.id)
    user2Id: User

    @CreateDateColumn()
    created_at: Date

}
