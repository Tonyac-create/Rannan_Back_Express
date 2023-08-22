import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, OneToOne } from "typeorm"
import { Data } from "./Data"
import { Validation } from "./Validation"
import { Contact } from "./Contact"
import { Group } from "./Group"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 45})
    nickname: string

    @Column({type: "varchar", length: 70})
    password: string

    @Column({type: "varchar", length: 45, unique: true})
    email: string

    @Column()
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