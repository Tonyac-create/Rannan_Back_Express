import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Validation {
   @PrimaryGeneratedColumn()
   id: number

   @Column()
   validation : Boolean

   @CreateDateColumn({ name: 'created_at' })
   createdAt: Date;

   @UpdateDateColumn({ name: 'updated_at' })
   updatedAt: Date;

   @ManyToOne(() => User, (user) => user.validations)
    user: User

}