import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column, ManyToMany, JoinTable} from "typeorm"
import { Data } from "./Data"

@Entity()
export class Authorization {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "enum", enum: ["group", "user"]})
    target: string

    @Column()
    target_id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToMany( () => Data)
    @JoinTable()
    datas : Data[]

}
