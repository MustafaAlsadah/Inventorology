import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/users.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signup(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<User> {
    const userExists = await this.userModel.findOne({ email }).exec();
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
  }

  async signin(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong password');
    }

    const payload = { userId: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async sendPasswordResetEmail(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const mailer = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Inventorology: Password reset',
      text: `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password/${user._id}\nYour OTP is: ${otp}`,
    };

    await mailer.sendMail(mailOptions);

    // Save the OTP in the database
    user.otp = otp;
    await user.save();

    return 'Email sent';
  }

  async resetPassword(
    email: string,
    new_password: string,
    entered_otp: string
  ): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (user.otp !== entered_otp) {
      throw new BadRequestException('Invalid OTP');
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;

    user.otp = null;
    return user.save();
  }
}
