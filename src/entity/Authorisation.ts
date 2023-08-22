import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column} from "typeorm"

@Entity()
export class Authorisation {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "enum", enum: ["group", "user"]})
    target: number

    @Column()
    target_id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}