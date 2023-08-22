import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Data } from "./Data"
import { Contact } from "./Contact"
import { Group } from "./Group"
import { Validation } from "./Validation"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nickname: string

    @Column()
    password: string

    @Column({unique: true})
    email: string

    @Column()
    avatar_id: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Contact, (contact) => contact.user)
    contacts: Contact[]

    @OneToMany ( () => Data, (data) => data.user)
    datas: Data[]

    @ManyToMany( () => Group)
    @JoinTable({ name: 'user_group' })
    groups : Group[]

    @OneToMany(() => Validation, (validation) => validation.user)
    validations: Validation[]
}