import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../application/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: Record<string, any>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
