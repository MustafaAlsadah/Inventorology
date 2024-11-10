import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    console.log(user);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id }).exec();
  }
}
