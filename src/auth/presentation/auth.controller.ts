import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '../../shared/cqrs';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dtos';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import {
  RegisterUserCommand,
  LoginUserCommand,
  RefreshTokenCommand,
} from '../application/commands/auth.commands';
import { User } from '../../user/domain/entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @Auth(AuthType.None)
  async register(
    @Body() dto: RegisterDto,
  ) {
    const command = new RegisterUserCommand(
      dto.tenantName,
      dto.name,
      dto.email,
      dto.password,
    );
    const result = await this.commandBus.execute<
      RegisterUserCommand,
      { user: User; accessToken: string; refreshToken: string }
    >(command);
    return {
      id: result.user.getId().getValue(),
      tenantId: result.user.getTenantId().getValue(),
      email: result.user.getEmail().getValue(),
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('login')
  @Auth(AuthType.None)
  async login(@Body() dto: LoginDto) {
    const command = new LoginUserCommand(dto.email, dto.password);
    return this.commandBus.execute(command);
  }

  @Post('refresh')
  @Auth(AuthType.None)
  async refresh(@Body() dto: RefreshTokenDto) {
    const command = new RefreshTokenCommand(dto.refreshToken);
    return this.commandBus.execute(command);
  }
}
