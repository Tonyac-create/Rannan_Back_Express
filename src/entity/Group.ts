import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm"

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

    @Column()
    limited_at: Date

}