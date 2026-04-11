import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}