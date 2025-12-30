import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HealthController } from './health.controller';
import databaseConfig from './config/database.config';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './logger/logger.module';
import { HttpLoggerMiddleware } from './logger/http-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './rbac/rbac.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>('database');
        if (!config) {
          throw new Error('Database configuration not found');
        }
        return config;
      },
    }),
    LoggerModule,
    SharedModule,
    AuthModule,
    RbacModule,
    UserModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware);
  }
}
