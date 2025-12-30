import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '../../shared/cqrs';
import {
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
} from '../application/user.commands';
import {
  GetUserQuery,
  ListUsersQuery,
} from '../application/user.queries';
import { User } from '../domain/entities';
import { TenantId } from '../../shared/decorators/tenant-id.decorator';
import { CreateUserDto, UpdateUserDto } from '../dtos';

/**
 * User Controller with CQRS Pattern
 * Uses CommandBus for write operations and QueryBus for read operations
 */
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post('create')
  async createUser(
    @TenantId() tenantId: string,
    @Body() request: CreateUserDto,
  ) {
    const command = new CreateUserCommand(tenantId, request.name, request.email);
    const user = await this.commandBus.execute<CreateUserCommand, User>(command);
    return this.mapUserToResponse(user);
  }

  @Get(':id')
  async getUser(@TenantId() tenantId: string, @Param('id') id: string) {
    const query = new GetUserQuery(tenantId, id);
    const user = await this.queryBus.execute<GetUserQuery, User>(query);
    return this.mapUserToResponse(user);
  }

  @Get()
  async listUsers(@TenantId() tenantId: string) {
    const query = new ListUsersQuery(tenantId);
    const users = await this.queryBus.execute<ListUsersQuery, User[]>(query);
    return users.map((user) => this.mapUserToResponse(user));
  }

  @Patch(':id')
  async updateUser(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    const command = new UpdateUserCommand(tenantId, id, body.name, body.email);
    const user = await this.commandBus.execute<UpdateUserCommand, User>(command);
    return this.mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUser(@TenantId() tenantId: string, @Param('id') id: string) {
    const command = new DeleteUserCommand(tenantId, id);
    await this.commandBus.execute(command);
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      tenantId: user.getTenantId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpatedAt(),
      accountAge: user.getAccountAge(),
    };
  }
}
