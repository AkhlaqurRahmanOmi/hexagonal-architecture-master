import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenServicePort } from '../application/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'dev-secret',
      expiresIn: '1d',
    });
  }

  async signRefreshToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') || 'dev-refresh-secret',
      expiresIn: '7d',
    });
  }

  async verifyAccessToken<T extends object = any>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.configService.get<string>('JWT_SECRET') || 'dev-secret',
    });
  }

  async verifyRefreshToken<T extends object = any>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') || 'dev-refresh-secret',
    });
  }
}
