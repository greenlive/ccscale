import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { USER_ROLES, UserRole } from './dto/auth.dto';

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 12; // 12 is the current bcrypt recommendation (2024+)

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private assertPasswordStrength(password: string): void {
    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
  }

  private assertRole(role: string): asserts role is UserRole {
    if (!(USER_ROLES as readonly string[]).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    return user;
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    role: string = 'VIEWER',
  ): Promise<User> {
    this.assertPasswordStrength(password);
    this.assertRole(role);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('User with this email already exists');
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    return this.prisma.user.create({
      data: { email, password: hashed, name, role },
    });
  }

  async hashPassword(password: string): Promise<string> {
    this.assertPasswordStrength(password);
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    this.assertPasswordStrength(newPassword);
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map(({ password, ...user }) => user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateUserRole(id: number, role: string): Promise<Omit<User, 'password'>> {
    this.assertRole(role);
    const user = await this.prisma.user.update({ where: { id }, data: { role } });
    const { password, ...result } = user;
    return result;
  }

  async resetUserPassword(id: number, newPassword: string): Promise<void> {
    await this.updatePassword(id, newPassword);
  }
}
