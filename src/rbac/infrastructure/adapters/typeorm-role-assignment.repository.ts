import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleAssignmentRepositoryPort } from '../../application/ports/role-assignment.repository.port';
import { UserRoleAssignmentEntity } from './user-role-assignment.orm-entity';
import { RolePermissionEntity } from './role-permission.orm-entity';
import { PermissionEntity } from './permission.orm-entity';

@Injectable()
export class TypeOrmRoleAssignmentRepository implements RoleAssignmentRepositoryPort {
  constructor(
    @InjectRepository(UserRoleAssignmentEntity)
    private readonly assignmentRepository: Repository<UserRoleAssignmentEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async assignRole(tenantId: string, userId: string, roleId: string): Promise<void> {
    const entity = new UserRoleAssignmentEntity();
    entity.tenantId = tenantId;
    entity.userId = userId;
    entity.roleId = roleId;
    await this.assignmentRepository.save(entity);
  }

  async removeRole(tenantId: string, userId: string, roleId: string): Promise<void> {
    await this.assignmentRepository.delete({ tenantId, userId, roleId });
  }

  async listRoleIdsForUser(tenantId: string, userId: string): Promise<string[]> {
    const rows = await this.assignmentRepository.find({ where: { tenantId, userId } });
    return rows.map((row) => row.roleId);
  }

  async listPermissionKeysForUser(tenantId: string, userId: string): Promise<string[]> {
    const roleIds = await this.listRoleIdsForUser(tenantId, userId);
    if (!roleIds.length) return [];

    const rolePermissions = await this.rolePermissionRepository
      .createQueryBuilder('rp')
      .where('rp.role_id IN (:...roleIds)', { roleIds })
      .getMany();

    const permissionIds = Array.from(
      new Set(rolePermissions.map((rp) => rp.permissionId)),
    );
    if (!permissionIds.length) return [];

    const permissions = await this.permissionRepository
      .createQueryBuilder('p')
      .where('p.id IN (:...permissionIds)', { permissionIds })
      .getMany();

    return permissions.map((p) => p.key);
  }
}
