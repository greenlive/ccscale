import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import configuration, { KEY as CONFIG_KEY } from '../config/configuration';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigType<typeof configuration>) => ({
        secret: config.jwt.secret,
        signOptions: { expiresIn: config.jwt.accessTtl as any },
      }),
      inject: [CONFIG_KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
