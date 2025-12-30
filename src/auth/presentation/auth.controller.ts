import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '../../shared/cqrs';
import { TenantId } from '../../shared/decorators/tenant-id.decorator';
import { RegisterDto, LoginDto } from '../dtos';
import { RegisterUserCommand, LoginUserCommand } from '../application/commands/auth.commands';
import { User } from '../../user/domain/entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(
    @TenantId() tenantId: string,
    @Body() dto: RegisterDto,
  ) {
    const command = new RegisterUserCommand(
      tenantId,
      dto.name,
      dto.email,
      dto.password,
    );
    const user = await this.commandBus.execute<RegisterUserCommand, User>(command);
    return {
      id: user.getId().getValue(),
      tenantId: user.getTenantId().getValue(),
      email: user.getEmail().getValue(),
    };
  }

  @Post('login')
  async login(@TenantId() tenantId: string, @Body() dto: LoginDto) {
    const command = new LoginUserCommand(tenantId, dto.email, dto.password);
    return this.commandBus.execute(command);
  }
}
