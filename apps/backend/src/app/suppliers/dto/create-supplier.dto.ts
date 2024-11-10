import { OmitType } from '@nestjs/mapped-types';
import { Supplier } from '../supplier.schema';

export class CreateSupplierDto extends OmitType(Supplier, ['email']) {}
