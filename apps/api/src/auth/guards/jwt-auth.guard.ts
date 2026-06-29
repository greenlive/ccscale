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

    // Prefer the httpOnly access cookie set by the backend on login.
    // The cookie path is the single source of truth in the browser; the
    // Authorization header is kept as a fallback for non-browser callers.
    const cookieToken: string | undefined = request.cookies?.cc_access;
    const authHeader: string | undefined = request.headers.authorization;

    let token: string | undefined;
    if (cookieToken && cookieToken.length > 0) {
      token = cookieToken;
    } else if (authHeader) {
      const [type, headerToken] = authHeader.split(' ');
      if (type !== 'Bearer' || !headerToken) {
        throw new UnauthorizedException('Invalid authorization format');
      }
      token = headerToken;
    }

    if (!token) {
      throw new UnauthorizedException('No authentication credentials provided');
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
