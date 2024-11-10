import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  address: string;

  @Prop()
  rating: number;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
