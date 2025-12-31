import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TenantMembershipRepositoryPort,
} from '../../application/ports/tenant-membership.repository.port';
import { MembershipRole, TenantMembership } from '../../domain/entities';
import { TenantMembershipEntity } from './tenant-membership.orm-entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TypeOrmTenantMembershipRepository
  implements TenantMembershipRepositoryPort
{
  constructor(
    @InjectRepository(TenantMembershipEntity)
    private readonly membershipRepository: Repository<TenantMembershipEntity>,
  ) {}

  async create(membership: TenantMembership): Promise<TenantMembership> {
    const entity = this.toEntity(membership);
    await this.membershipRepository.save(entity);
    return membership;
  }

  async update(membership: TenantMembership): Promise<TenantMembership> {
    const entity = this.toEntity(membership);
    await this.membershipRepository.save(entity);
    return membership;
  }

  async findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<TenantMembership | null> {
    const entity = await this.membershipRepository.findOne({
      where: { tenantId, userId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async listByTenant(tenantId: string): Promise<TenantMembership[]> {
    const entities = await this.membershipRepository.find({ where: { tenantId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async listByUser(userId: string): Promise<TenantMembership[]> {
    const entities = await this.membershipRepository.find({ where: { userId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async remove(tenantId: string, userId: string): Promise<void> {
    await this.membershipRepository.delete({ tenantId, userId });
  }

  async updateRole(
    tenantId: string,
    userId: string,
    role: MembershipRole,
  ): Promise<void> {
    await this.membershipRepository.update({ tenantId, userId }, { role });
  }

  private toEntity(membership: TenantMembership): TenantMembershipEntity {
    const entity = new TenantMembershipEntity();
    entity.id = membership.getId() || randomUUID();
    entity.tenantId = membership.getTenantId();
    entity.userId = membership.getUserId();
    entity.role = membership.getRole();
    entity.status = membership.getStatus();
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  private toDomain(entity: TenantMembershipEntity): TenantMembership {
    return new TenantMembership(
      entity.id,
      entity.tenantId,
      entity.userId,
      entity.role,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
