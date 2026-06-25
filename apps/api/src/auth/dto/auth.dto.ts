import { IsEmail, IsString, MinLength, IsOptional, IsIn, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const USER_ROLES = ['ADMIN', 'EDITOR', 'VIEWER'] as const;
export type UserRole = typeof USER_ROLES[number];
export const UserRoleEnum = { ADMIN: 'ADMIN', EDITOR: 'EDITOR', VIEWER: 'VIEWER' } as const;

export class LoginDto {
  @ApiProperty({ example: 'admin@ccscale.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'admin@ccscale.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Admin User' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: USER_ROLES, default: 'VIEWER' })
  @IsOptional()
  @IsIn(USER_ROLES, { message: 'role must be one of ADMIN, EDITOR, VIEWER' })
  role?: UserRole;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: USER_ROLES })
  @IsIn(USER_ROLES, { message: 'role must be one of ADMIN, EDITOR, VIEWER' })
  role: UserRole;
}

export class AuthResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;
}
