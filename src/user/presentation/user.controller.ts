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
} from '../application/commands';
import {
  GetUserQuery,
  ListUsersQuery,
} from '../application/queries';
import { User } from '../domain/entities';

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
  async createUser(@Body() request: { name: string; email: string }) {
    const command = new CreateUserCommand(request.name, request.email);
    const user = await this.commandBus.execute<CreateUserCommand, User>(command);
    return this.mapUserToResponse(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const user = await this.queryBus.execute<GetUserQuery, User>(query);
    return this.mapUserToResponse(user);
  }

  @Get()
  async listUsers() {
    const query = new ListUsersQuery();
    const users = await this.queryBus.execute<ListUsersQuery, User[]>(query);
    return users.map((user) => this.mapUserToResponse(user));
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string },
  ) {
    const command = new UpdateUserCommand(id, body.name, body.email);
    const user = await this.commandBus.execute<UpdateUserCommand, User>(command);
    return this.mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const command = new DeleteUserCommand(id);
    await this.commandBus.execute(command);
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpatedAt(),
      accountAge: user.getAccountAge(),
    };
  }
}
