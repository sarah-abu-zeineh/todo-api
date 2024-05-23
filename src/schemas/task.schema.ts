import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskState } from 'src/enums/taskState.enum';

@Schema()
export class Task extends Document {
    @Prop()
    title: string;

    @Prop({ required: true })
    desc: string;

    @Prop({ required: true, enum: TaskState, default: TaskState.PENDING })
    status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
