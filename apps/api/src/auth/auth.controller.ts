import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Inject,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { LoginDto, RegisterDto, UpdatePasswordDto, ResetPasswordDto, UpdateUserRoleDto, AuthResponse } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import configuration, { CONFIGURATION_KEY } from '../config/configuration';

import { setAuthCookies, clearAuthCookies } from './auth-cookies';

export const ACCESS_COOKIE = 'cc_access';
export const REFRESH_COOKIE = 'cc_refresh';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(CONFIGURATION_KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: this.config.jwt.accessTtl as any });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: this.config.jwt.refreshTtl as any },
    );

    setAuthCookies(res, this.config, accessToken, refreshToken);

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  async refresh(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    const refreshToken: string | undefined =
      req.cookies?.[REFRESH_COOKIE] ?? req.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.config.jwt.secret });
      if (payload.type !== 'refresh' || !payload.sub) {
        throw new Error('invalid type');
      }
      const user = await this.authService.getUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        { expiresIn: this.config.jwt.accessTtl as any },
      );
      setAuthCookies(res, this.config, accessToken, undefined);
      return { ok: true };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  @ApiOperation({ summary: 'Logout user (clear auth cookies)' })
  async logout(@Res({ passthrough: true }) res: Response): Promise<{ ok: true }> {
    clearAuthCookies(res, this.config);
    return { ok: true };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @ApiOperation({ summary: 'Register new user (admin only)' })
  @ApiResponse({ status: 201, description: 'User created', type: AuthResponse })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    if (!registerDto.role) registerDto.role = 'VIEWER';
    const user = await this.authService.createUser(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.role,
    );
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @SkipThrottle()
  @ApiOperation({ summary: 'Get current user' })
  async getCurrentUser(@Request() req): Promise<AuthResponse> {
    const user = await this.authService.getUserById(req.user.id);
    if (!user) throw new UnauthorizedException('User not found');
    const { password: _pw, ...result } = user as any;
    return result;
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Update password' })
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.authService.validateUser(req.user.email, updatePasswordDto.currentPassword);
    if (!user) throw new UnauthorizedException('Current password is incorrect');
    await this.authService.updatePassword(req.user.id, updatePasswordDto.newPassword);
    return { message: 'Password updated successfully' };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @SkipThrottle()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Put('users/:id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @SkipThrottle()
  @ApiOperation({ summary: 'Update user role (admin only)' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<AuthResponse> {
    const user = await this.authService.updateUserRole(parseInt(id, 10), dto.role);
    const { password: _pw, ...result } = user as any;
    return result;
  }

  @Post('users/:id/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipThrottle()
  @ApiOperation({ summary: 'Delete user (admin only)' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.authService.deleteUser(parseInt(id, 10));
  }

  @Post('users/:id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCookieAuth(ACCESS_COOKIE)
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset user password (admin only)' })
  async resetUserPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetUserPassword(parseInt(id, 10), resetPasswordDto.newPassword);
    return { message: 'Password reset successfully' };
  }
}
