import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantDomainRepositoryPort } from '../../application/ports/tenant-domain.repository.port';
import { TenantDomain } from '../../domain/entities';
import { TenantDomainEntity } from './tenant-domain.orm-entity';

@Injectable()
export class TypeOrmTenantDomainRepository implements TenantDomainRepositoryPort {
  constructor(
    @InjectRepository(TenantDomainEntity)
    private readonly domainRepository: Repository<TenantDomainEntity>,
  ) {}

  async create(domain: TenantDomain): Promise<TenantDomain> {
    const entity = this.toEntity(domain);
    await this.domainRepository.save(entity);
    return domain;
  }

  async findByDomain(domain: string): Promise<TenantDomain | null> {
    const entity = await this.domainRepository.findOne({
      where: { domain: domain.toLowerCase() },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async listByTenant(tenantId: string): Promise<TenantDomain[]> {
    const entities = await this.domainRepository.find({ where: { tenantId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async verify(tenantId: string, domainId: string): Promise<void> {
    await this.domainRepository.update(
      { tenantId, id: domainId },
      { status: 'verified' },
    );
  }

  async remove(tenantId: string, domainId: string): Promise<void> {
    await this.domainRepository.delete({ tenantId, id: domainId });
  }

  private toEntity(domain: TenantDomain): TenantDomainEntity {
    const entity = new TenantDomainEntity();
    entity.id = domain.getId();
    entity.tenantId = domain.getTenantId();
    entity.domain = domain.getDomain();
    entity.status = domain.getStatus();
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  private toDomain(entity: TenantDomainEntity): TenantDomain {
    return new TenantDomain(
      entity.id,
      entity.tenantId,
      entity.domain,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
