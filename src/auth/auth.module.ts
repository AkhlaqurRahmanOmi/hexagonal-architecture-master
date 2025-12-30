import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedCqrsModule } from '../shared/cqrs';
import { AuthController } from './presentation/auth.controller';
import { AUTH_HANDLERS } from './application/handlers/auth.handlers';
import { PASSWORD_HASHER, TOKEN_SERVICE } from './application/ports';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { JwtTokenService } from './infrastructure/jwt-token.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SharedCqrsModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...AUTH_HANDLERS,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
  ],
})
export class AuthModule {}
