import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Data } from "./Data"


export enum TargetFormat {
    GROUP = "group",
    USER = "user"
}

@Entity()
export class Share {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: TargetFormat
        })
    target: string

    @Column()
    target_id: number

    @Column()
    owner_id: number

    @CreateDateColumn()
    created_at: Date

    @ManyToMany( () => Data)
    @JoinTable({
        name: "data_has_share",
        joinColumn: { name: "share_id" },
        inverseJoinColumn: { name: "data_id" }
    })
    datas : Data[]
}
