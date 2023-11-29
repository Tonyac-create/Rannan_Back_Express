import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type DataDocument = HydratedDocument<Data>

enum DataFormat {
    TEXT = "text",
    NUMBER = "number",
    URL = "url",
    MAIL = "mail",
    FILE = "file"
}

@Schema({ collection: "data", timestamps: true, versionKey: false })
export class Data {
    // One-to-many avec un user
    @Prop({
        type: Number,
        required: true,
        ref: "User"
    })
    user_id: Number

    @Prop({ type: String, enum: DataFormat })
    typeData: DataFormat

    @Prop({ required: true, type: String })
    name: String

    @Prop({ required: true, type: String })
    value: String

    // Many-to-many avec share
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Share' }],
        default: [],
    })
    share: mongoose.Types.Array<string>
}

export const dataSchema = SchemaFactory.createForClass(Data)