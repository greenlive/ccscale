import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all testimonials' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Return all testimonials' })
  findAll(@Query('isActive') isActive?: string) {
    return this.testimonialsService.findAll(
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get testimonial statistics' })
  @ApiResponse({ status: 200, description: 'Return testimonial stats' })
  getStats() {
    return this.testimonialsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get testimonial by id' })
  @ApiResponse({ status: 200, description: 'Return the testimonial' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({ status: 201, description: 'Testimonial created' })
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial updated' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial deleted' })
  @ApiResponse({ status: 404, description: 'Testimonial not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialsService.remove(id);
  }
}
