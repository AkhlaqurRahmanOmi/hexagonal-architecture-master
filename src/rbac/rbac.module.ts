import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedCqrsModule } from '../shared/cqrs';
import { RbacController } from './presentation/rbac.controller';
import { ROLE_HANDLERS } from './application/handlers/role.handlers';
import { PERMISSION_HANDLERS } from './application/handlers/permission.handlers';
import {
  ROLE_REPOSITORY,
  PERMISSION_REPOSITORY,
  ROLE_ASSIGNMENT_REPOSITORY,
} from './application/ports';
import { TypeOrmRoleRepository } from './infrastructure/adapters/typeorm-role.repository';
import { TypeOrmPermissionRepository } from './infrastructure/adapters/typeorm-permission.repository';
import { TypeOrmRoleAssignmentRepository } from './infrastructure/adapters/typeorm-role-assignment.repository';
import { RoleEntity } from './infrastructure/adapters/role.orm-entity';
import { PermissionEntity } from './infrastructure/adapters/permission.orm-entity';
import { RolePermissionEntity } from './infrastructure/adapters/role-permission.orm-entity';
import { UserRoleAssignmentEntity } from './infrastructure/adapters/user-role-assignment.orm-entity';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [
    SharedCqrsModule,
    UserModule,
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      UserRoleAssignmentEntity,
    ]),
  ],
  controllers: [RbacController],
  providers: [
    ...ROLE_HANDLERS,
    ...PERMISSION_HANDLERS,
    {
      provide: ROLE_REPOSITORY,
      useClass: TypeOrmRoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: TypeOrmPermissionRepository,
    },
    {
      provide: ROLE_ASSIGNMENT_REPOSITORY,
      useClass: TypeOrmRoleAssignmentRepository,
    },
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    RolesGuard,
    PermissionsGuard,
    ROLE_REPOSITORY,
    ROLE_ASSIGNMENT_REPOSITORY,
  ],
})
export class RbacModule {}
