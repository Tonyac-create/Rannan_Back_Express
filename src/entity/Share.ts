import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column } from "typeorm"

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

}
