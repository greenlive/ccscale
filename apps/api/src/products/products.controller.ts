import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ProductsService, ImportResult } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { PaginationQueryDto } from '../inquiries/dto/inquiry.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsIn, Max, Min } from 'class-validator';

class ProductListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}

class ProductSearchQueryDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @Type(() => Number) @IsInt() categoryId?: number;
  @IsOptional() @Type(() => Number) @IsInt() minPrice?: number;
  @IsOptional() @Type(() => Number) @IsInt() maxPrice?: number;
  @IsOptional() @IsIn(['nameEn', 'nameZh', 'priceMin', 'priceMax', 'createdAt', 'order']) sortBy?: string;
  @IsOptional() @IsIn(['asc', 'desc']) sortOrder?: 'asc' | 'desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize?: number = 20;
}

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products (paginated)' })
  findAll(@Query() q: ProductListQueryDto) {
    return this.productsService.findAll(
      q.categoryId,
      q.isActive !== false,
      q.page ?? 1,
      q.pageSize ?? 20,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  findCategories(@Query('isActive') isActive?: string) {
    return this.productsService.findCategories(isActive !== 'false');
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Return the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get('related/:id')
  @ApiOperation({ summary: 'Get related products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return related products' })
  findRelated(@Param('id') id: string, @Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : 4;
    if (!Number.isFinite(n) || n < 1 || n > 20) {
      throw new BadRequestException('limit must be 1-20');
    }
    return this.productsService.findRelated(parseInt(id, 10), n);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Return search results with pagination' })
  search(@Query() q: ProductSearchQueryDto) {
    return this.productsService.search({
      q: q.q,
      categoryId: q.categoryId,
      minPrice: q.minPrice,
      maxPrice: q.maxPrice,
      sortBy: q.sortBy,
      sortOrder: q.sortOrder,
      page: q.page ?? 1,
      pageSize: q.pageSize ?? 20,
    });
  }

  @Post('batch/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 imports per minute per user
  @ApiOperation({ summary: 'Batch import products from CSV' })
  @ApiResponse({ status: 201, description: 'Import result' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async batchImport(@Req() req: Request): Promise<ImportResult> {
    const csv = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    return this.productsService.batchImport(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Return the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    const parsed = parseInt(id, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) throw new BadRequestException('Invalid id');
    return this.productsService.findOne(parsed);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(parseInt(id, 10), updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(parseInt(id, 10));
  }
}
