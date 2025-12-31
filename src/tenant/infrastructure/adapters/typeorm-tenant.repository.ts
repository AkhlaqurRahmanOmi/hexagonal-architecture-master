import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantRepositoryPort } from '../../application/ports/tenant.repository.port';
import { Tenant } from '../../domain/entities';
import { TenantEntity } from './tenant.orm-entity';
import { TenantId } from '../../domain/value-objects';

@Injectable()
export class TypeOrmTenantRepository implements TenantRepositoryPort {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async create(tenant: Tenant): Promise<Tenant> {
    const entity = this.toEntity(tenant);
    await this.tenantRepository.save(entity);
    return tenant;
  }

  async update(tenant: Tenant): Promise<Tenant> {
    const entity = this.toEntity(tenant);
    await this.tenantRepository.save(entity);
    return tenant;
  }

  async findById(id: string): Promise<Tenant | null> {
    const entity = await this.tenantRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Tenant | null> {
    const entity = await this.tenantRepository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async list(): Promise<Tenant[]> {
    const entities = await this.tenantRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  private toEntity(tenant: Tenant): TenantEntity {
    const entity = new TenantEntity();
    entity.id = tenant.getId().getValue();
    entity.name = tenant.getName();
    entity.status = tenant.getStatus();
    entity.createdAt = tenant.getCreatedAt() || new Date();
    entity.updatedAt = tenant.getUpdatedAt() || new Date();
    return entity;
  }

  private toDomain(entity: TenantEntity): Tenant {
    return new Tenant(
      new TenantId(entity.id),
      entity.name,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
