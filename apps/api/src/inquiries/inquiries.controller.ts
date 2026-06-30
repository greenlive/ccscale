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
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import {
  CreateInquiryDto,
  UpdateInquiryDto,
  CreateActivityLogDto,
  PaginationQueryDto,
  INQUIRY_STATUSES,
} from './dto/inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { TurnstileService } from '../common/turnstile.service';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly turnstile: TurnstileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries (admin only)' })
  @SkipThrottle()
  @ApiQuery({ name: 'status', required: false, enum: INQUIRY_STATUSES })
  @ApiResponse({ status: 200, description: 'Return all inquiries' })
  findAll(
    @Query('status') status: string | undefined,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.inquiriesService.findAll(
      status,
      pagination.page ?? 1,
      pagination.pageSize ?? 20,
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry statistics' })
  @SkipThrottle()
  @ApiResponse({ status: 200, description: 'Return inquiry stats' })
  getStats() {
    return this.inquiriesService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by id' })
  @SkipThrottle()
  @ApiResponse({ status: 200, description: 'Return the inquiry' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inquiriesService.findOne(id);
  }

  @Get(':id/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity logs for an inquiry' })
  @SkipThrottle()
  @ApiResponse({ status: 200, description: 'Return activity logs' })
  getActivityLogs(@Param('id', ParseIntPipe) id: number) {
    return this.inquiriesService.getActivityLogs(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 inquiries per minute per IP
  @ApiOperation({ summary: 'Create a new inquiry (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Inquiry created' })
  @ApiResponse({ status: 429, description: 'Too many inquiries' })
  async create(
    @Body() createInquiryDto: CreateInquiryDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.turnstile.verify(createInquiryDto.turnstileToken, ip);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInquiryDto: UpdateInquiryDto,
    @Request() req,
  ) {
    const parsed = id;
    const result = await this.inquiriesService.update(parsed, updateInquiryDto);
    await this.inquiriesService.createActivityLog({
      inquiryId: parsed,
      action: 'UPDATED',
      detail: `Updated by ${req.user.email}`,
      performedBy: req.user.email,
    });
    return result;
  }

  @Post(':id/activities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add activity log to an inquiry' })
  @ApiResponse({ status: 201, description: 'Activity log created' })
  addActivityLog(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateActivityLogDto,
    @Request() req,
  ) {
    dto.inquiryId = id;
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
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.inquiriesService.delete(id);
  }

  @Post(':id/contact-attempt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record a contact attempt for an inquiry' })
  @ApiResponse({ status: 201, description: 'Contact attempt recorded' })
  addContactAttempt(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { method: string; success: boolean },
    @Request() req,
  ) {
    return this.inquiriesService.addContactAttempt(
      id,
      body.method,
      body.success,
      req.user.email,
    );
  }
}
