import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user', required: true })
  role: string;

  @Prop({ default: null, required: false })
  otp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
