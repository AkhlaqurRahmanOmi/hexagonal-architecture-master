import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { PermissionRepositoryPort } from '../../application/ports/permission.repository.port';
import { Permission } from '../../domain/entities';
import { PermissionEntity } from './permission.orm-entity';
import { PermissionId } from '../../domain/value-objects';

@Injectable()
export class TypeOrmPermissionRepository implements PermissionRepositoryPort {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async create(permission: Permission): Promise<Permission> {
    const entity = this.toEntity(permission);
    await this.permissionRepository.save(entity);
    return permission;
  }

  async update(permission: Permission): Promise<Permission> {
    const entity = this.toEntity(permission);
    await this.permissionRepository.save(entity);
    return permission;
  }

  async findById(id: string): Promise<Permission | null> {
    const entity = await this.permissionRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByKey(key: string): Promise<Permission | null> {
    const entity = await this.permissionRepository.findOne({ where: { key } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    if (!ids.length) return [];
    const entities = await this.permissionRepository.find({ where: { id: In(ids) } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async list(): Promise<Permission[]> {
    const entities = await this.permissionRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.permissionRepository.delete({ id });
  }

  private toEntity(permission: Permission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = permission.getId().getValue();
    entity.key = permission.getKey();
    entity.description = permission.getDescription() || null;
    entity.createdAt = permission.getCreatedAt() || new Date();
    entity.updatedAt = permission.getUpdatedAt() || new Date();
    return entity;
  }

  private toDomain(entity: PermissionEntity): Permission {
    return new Permission(
      new PermissionId(entity.id),
      entity.key,
      entity.description || undefined,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
