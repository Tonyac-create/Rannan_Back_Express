import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, JoinTable, ManyToMany, ManyToOne} from "typeorm"
import { User } from "./User"

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 45})
    name: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column({ nullable: true, default: null }) // Setting nullable and default to null
    limited_at: Date | null;

    @Column()
    creator_id: number;

    @ManyToOne(() => User, (user) => user.groupsCreated)
    @JoinColumn({name: "creator_id"})
    creator: User

}