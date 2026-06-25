import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import configuration, { CONFIGURATION_KEY } from '../../config/configuration';
import { ConfigType } from '@nestjs/config';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CONFIGURATION_KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      // secret is loaded from validated config (throws on boot if missing in production)
      const decoded = this.jwtService.verify(token, {
        secret: this.config.jwt.secret,
      });

      if (!decoded.sub || !decoded.email || !decoded.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
