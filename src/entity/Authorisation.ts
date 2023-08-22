import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Data } from "./Data"

@Entity()
export class Authorisation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    target: number

    @Column()
    target_id: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}