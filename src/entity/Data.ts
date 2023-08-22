import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Authorisation } from "./Authorisation"

@Entity()
export class Data {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: number

    @Column()
    name: string

    @Column()
    value: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.datas)
    user: User

    @ManyToMany( () => Authorisation)
    @JoinTable({ name: 'data_authorisation' })
    authorisations : Authorisation[]

}