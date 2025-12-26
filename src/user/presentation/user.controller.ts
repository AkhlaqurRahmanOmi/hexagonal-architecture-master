import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserUseCase,
  ListUsersUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase,
  GetUserUseCase,
  UpdateUserDto,
} from '../application/use-cases';
import { User } from '../domain/entities';

@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('create')
  async createUser(@Body() request: CreateUserDto) {
    const user = await this.createUserUseCase.execute(request);
    return this.mapUserToResponse(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.getUserUseCase.execute(id);
    return this.mapUserToResponse(user);
  }

  @Get()
  async listUsers() {
    const users = await this.listUsersUseCase.execute();
    return users.map((user) => this.mapUserToResponse(user));
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.updateUserUseCase.execute(id, body);
    return this.mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);
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
