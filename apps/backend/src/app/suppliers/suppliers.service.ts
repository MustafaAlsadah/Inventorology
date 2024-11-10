import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './supplier.schema';
import { Model } from 'mongoose';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const newSupplier = new this.supplierModel(createSupplierDto);
    return await newSupplier.save();
  }
  async findAll() {
    return await this.supplierModel.find().exec();
  }

  async findOne(id: string) {
    return await this.supplierModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    return await this.supplierModel
      .findOneAndUpdate({ _id: id }, updateSupplierDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.supplierModel.deleteOne({ _id: id }).exec();
  }
}
