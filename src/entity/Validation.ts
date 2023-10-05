import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Validation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: "user_id"})
    user: User

    @Column()
    contact_id: number

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: "contact_id"})
    contact: User

    @Column({type: "tinyint", default: 0})
    validation: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
