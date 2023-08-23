import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 45})
    name: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ nullable: true, default: null }) // Setting nullable and default to null
    limited_at: Date | null;

}
