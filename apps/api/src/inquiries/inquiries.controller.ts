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
  Ip,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, UpdateInquiryDto, CreateActivityLogDto } from './dto/inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries (admin only)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return all inquiries' })
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.inquiriesService.findAll(
      status,
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 20,
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry statistics' })
  @ApiResponse({ status: 200, description: 'Return inquiry stats' })
  getStats() {
    return this.inquiriesService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by id' })
  @ApiResponse({ status: 200, description: 'Return the inquiry' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(parseInt(id));
  }

  @Get(':id/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity logs for an inquiry' })
  @ApiResponse({ status: 200, description: 'Return activity logs' })
  getActivityLogs(@Param('id') id: string) {
    return this.inquiriesService.getActivityLogs(parseInt(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 inquiries per minute max
  @ApiOperation({ summary: 'Create a new inquiry (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Inquiry created' })
  @ApiResponse({ status: 429, description: 'Too many inquiries' })
  create(
    @Body() createInquiryDto: CreateInquiryDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.inquiriesService.create(createInquiryDto, ip, userAgent);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an inquiry (admin/editor only)' })
  @ApiResponse({ status: 200, description: 'Inquiry updated' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto, @Request() req) {
    // Log the update activity
    this.inquiriesService.createActivityLog({
      inquiryId: parseInt(id),
      action: 'STATUS_CHANGE',
      detail: `Updated by ${req.user.email}`,
      performedBy: req.user.email,
    });
    return this.inquiriesService.update(parseInt(id), updateInquiryDto);
  }

  @Post(':id/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add activity log to an inquiry' })
  @ApiResponse({ status: 201, description: 'Activity log created' })
  addActivityLog(@Param('id') id: string, @Body() dto: CreateActivityLogDto, @Request() req) {
    dto.inquiryId = parseInt(id);
    dto.performedBy = req.user.email;
    return this.inquiriesService.createActivityLog(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inquiry (admin only)' })
  @ApiResponse({ status: 204, description: 'Inquiry deleted' })
  async delete(@Param('id') id: string) {
    await this.inquiriesService.delete(parseInt(id));
  }

  @Post(':id/contact-attempt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record a contact attempt for an inquiry' })
  @ApiResponse({ status: 201, description: 'Contact attempt recorded' })
  addContactAttempt(@Param('id') id: string, @Body() body: { method: string; success: boolean }, @Request() req) {
    return this.inquiriesService.addContactAttempt(
      parseInt(id),
      body.method,
      body.success,
      req.user.email,
    );
  }
}
