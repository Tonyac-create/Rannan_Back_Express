import { Entity, ManyToOne, CreateDateColumn, JoinColumn, Column, PrimaryGeneratedColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user1_id: number

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({name: "user1_id"})
    user1: User

    @Column()
    user2_id: number

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({name: "user2_id"})
    user2: User

    @CreateDateColumn()
    created_at: Date

}
