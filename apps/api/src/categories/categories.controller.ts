import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('categories')
@Controller('products/categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  // findAll() is handled by ProductsController @Get('categories')
  // CRUD operations below only use :id, :slug, POST, PUT, DELETE

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Return the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteCategory(id);
  }
}