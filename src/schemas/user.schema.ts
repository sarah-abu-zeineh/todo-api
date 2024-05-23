import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Task } from './task.schema';

@Schema()
export class User extends Document {
    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    userImg?: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }] })
    tasks: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
