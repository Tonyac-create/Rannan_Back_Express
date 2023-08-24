import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Authorisation } from "./Authorisation"

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
    format: DataFormat

    @Column({type: "varchar", length: 45})
    name: string

    @Column({type: "varchar", length: 250})
    value: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.datas)
    user: User

    @ManyToMany( () => Authorisation)
    @JoinTable()
    authorisations : Authorisation[]

}
