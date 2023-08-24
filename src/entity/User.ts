import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Data } from "./Data"
import { Validation } from "./Validation"
import { Contact } from "./Contact"
import { Group } from "./Group"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 45, default: ""})
    nickname: string

    @Column({type: "varchar", length: 70, default: ""})
    password: string

    @Column({type: "varchar", length: 45,default: "", unique: true})
    email: string

    @Column({default: 0})
    avatar_id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @OneToMany(() => Validation, (validation) => validation.user)
    user: User[]

    @OneToMany(() => Validation, (validation) => validation.contact)
    contact: User[]

    @OneToMany(() => Contact, (contact) => contact.user1)
    users1: Contact[]

    @OneToMany(() => Contact, (contact) => contact.user2)
    users2: Contact[]

    @OneToMany ( () => Data, (data) => data.user)
    datas: Data[]

    @ManyToMany( () => Group)
    @JoinTable()
    groups : Group[]

}
