import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column } from "typeorm"

export enum TargetFormat {
    GROUP = "group",
    USER = "user"
}

@Entity()
export class Authorization {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: TargetFormat
        })
    target: string

    @Column()
    target_id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
