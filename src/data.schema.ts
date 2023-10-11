import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type DataDocument = HydratedDocument<Data>

export enum Type {
    "TEXT",
    "URL",
    "NUMBER",
    "MAIL",
    "FILE",
    }

@Schema({ collection: 'datas', timestamps: true, versionKey: false })
export class Data {
    @Prop({
        required: true
    })
    type: Type

    @Prop({
        required: true
    })
    name: string

    @Prop({
        required: true
    })
    value: string

    @Prop({
        required: true
    })
    user_id: number

    @Prop()
    authorisation: [
        { target: string, target_id: number }
    ]

}

export const DataSchema = SchemaFactory.createForClass(Data)