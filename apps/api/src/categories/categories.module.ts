import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}