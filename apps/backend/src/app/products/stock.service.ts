import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ProductsService } from './products.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StockService {
  private readonly mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  constructor(private readonly productsService: ProductsService) {}

  @Cron('0 0 * * *')
  async sendLowStockEmails() {
    const products = await this.productsService.findAll();
    const lowStockProducts = products.filter(
      (product) => product.stock <= product.min_stock_alert
    );
    if (lowStockProducts.length === 0) {
      return;
    }

    const emailContent = lowStockProducts
      .map(
        (product) =>
          `${product.name} is running low on stock. Current stock: ${product.stock}`
      )
      .join('\n');

    await this.mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Low Stock Alert',
      text: emailContent,
    });
  }
}
