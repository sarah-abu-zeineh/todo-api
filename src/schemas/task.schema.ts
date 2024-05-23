import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
    @Prop()
    title: string;

    @Prop({ required: true })
    desc: string;

    @Prop({ required: true })
    status: string;

    image? : string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
