import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.findOne({
      name: createProductDto.name,
    });
    if (product) {
      throw new Error('Product already exists');
    }

    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().populate('supplier').exec();
  }

  async findOne(id: string) {
    return await await this.productModel
      .findOne({ _id: id })
      .populate('supplier')
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel
      .findOneAndUpdate({ _id: id }, updateProductDto, { new: true })
      .populate('supplier')
      .exec();
  }

  async remove(id: string) {
    return await this.productModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }
}
