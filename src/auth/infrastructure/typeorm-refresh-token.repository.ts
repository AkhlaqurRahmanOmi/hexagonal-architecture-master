import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RefreshTokenRepositoryPort,
} from '../application/ports/refresh-token.repository.port';
import { RefreshTokenEntity } from './refresh-token.orm-entity';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async saveHashedToken(params: {
    tenantId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    const existing = await this.refreshTokenRepository.findOne({
      where: { tenantId: params.tenantId, userId: params.userId },
    });

    if (existing) {
      existing.tokenHash = params.tokenHash;
      existing.expiresAt = params.expiresAt;
      await this.refreshTokenRepository.save(existing);
      return;
    }

    const entity = new RefreshTokenEntity();
    entity.tenantId = params.tenantId;
    entity.userId = params.userId;
    entity.tokenHash = params.tokenHash;
    entity.expiresAt = params.expiresAt;
    await this.refreshTokenRepository.save(entity);
  }

  async findValidTokenHash(
    tenantId: string,
    userId: string,
  ): Promise<string | null> {
    const entity = await this.refreshTokenRepository.findOne({
      where: { tenantId, userId },
    });
    if (!entity) return null;
    if (entity.expiresAt.getTime() < Date.now()) {
      return null;
    }
    return entity.tokenHash;
  }

  async revoke(tenantId: string, userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ tenantId, userId });
  }
}
