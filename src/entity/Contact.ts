import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import { User } from "./User"

@Entity()
export class Contact {
   @PrimaryGeneratedColumn()
   id: number

   @Column()
   validation : Boolean

   @Column()
   contact_id: number

   @ManyToOne(() => User, (user) => user.contacts)
    user: User
   
}