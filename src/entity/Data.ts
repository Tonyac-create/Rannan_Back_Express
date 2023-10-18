import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm"
import { User } from "./User"
import { Share } from "./Share"

export enum DataFormat {
    TEXT = "text",
    NUMBER = "number",
    URL = "url",
    MAIL = "mail",
    FILE = "file"
}

@Entity()
export class Data {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: DataFormat
        })
    type: DataFormat

    @Column({type: "varchar", length: 45})
    name: string

    @Column({type: "varchar", length: 250})
    value: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column()
    user_id: number

    @ManyToOne(() => User, (user) => user.datas)
    @JoinColumn({name: "user_id"})
    user: User

    @ManyToMany( () => Share)
    @JoinTable({
        name: "data_has_share",
        joinColumn: { name: "data_id" },
        inverseJoinColumn: { name: "share_id" }
    })
    authorizations : Share[]

}
