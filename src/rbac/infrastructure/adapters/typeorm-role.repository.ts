import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleRepositoryPort } from '../../application/ports/role.repository.port';
import { Role } from '../../domain/entities';
import { RoleEntity } from './role.orm-entity';
import { RolePermissionEntity } from './role-permission.orm-entity';
import { RoleId } from '../../domain/value-objects';
import { In } from 'typeorm';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepositoryPort {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
  ) {}

  async create(role: Role): Promise<Role> {
    const entity = this.toEntity(role);
    await this.roleRepository.save(entity);
    return role;
  }

  async update(role: Role): Promise<Role> {
    const entity = this.toEntity(role);
    await this.roleRepository.save(entity);
    return role;
  }

  async findById(tenantId: string, id: string): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { id, tenantId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByName(tenantId: string, name: string): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { tenantId, name },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async list(tenantId: string): Promise<Role[]> {
    const entities = await this.roleRepository.find({ where: { tenantId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByIds(tenantId: string, ids: string[]): Promise<Role[]> {
    if (!ids.length) return [];
    const entities = await this.roleRepository.find({
      where: { tenantId, id: In(ids) },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.rolePermissionRepository.delete({ roleId: id });
    await this.roleRepository.delete({ id, tenantId });
  }

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (!permissionIds.length) return;
    const records = permissionIds.map((permissionId) => {
      const entity = new RolePermissionEntity();
      entity.roleId = roleId;
      entity.permissionId = permissionId;
      return entity;
    });
    await this.rolePermissionRepository.save(records);
  }

  async removePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (!permissionIds.length) return;
    await this.rolePermissionRepository
      .createQueryBuilder()
      .delete()
      .where('role_id = :roleId', { roleId })
      .andWhere('permission_id IN (:...permissionIds)', { permissionIds })
      .execute();
  }

  async getPermissionIds(roleId: string): Promise<string[]> {
    const rows = await this.rolePermissionRepository.find({ where: { roleId } });
    return rows.map((row) => row.permissionId);
  }

  private toEntity(role: Role): RoleEntity {
    const entity = new RoleEntity();
    entity.id = role.getId().getValue();
    entity.tenantId = role.getTenantId();
    entity.name = role.getName();
    entity.description = role.getDescription() || null;
    entity.createdAt = role.getCreatedAt() || new Date();
    entity.updatedAt = role.getUpdatedAt() || new Date();
    return entity;
  }

  private toDomain(entity: RoleEntity): Role {
    return new Role(
      new RoleId(entity.id),
      entity.tenantId,
      entity.name,
      entity.description || undefined,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
