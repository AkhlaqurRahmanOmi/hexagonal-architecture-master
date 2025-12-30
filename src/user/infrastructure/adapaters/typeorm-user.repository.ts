import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../application/ports';
import { User } from '../../domain/entities';
import { UserEntity } from './user.orm-entity';

import { userId, Email, TenantId } from '../../domain/value-objects';

/**
 * TypeORM implementation of UserRepositoryPort
 * This adapter translates between domain entities and database entities
 */
@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async save(user: User): Promise<User> {
        // Map domain entity to database entity
        const userEntity = new UserEntity();
        userEntity.id = user.getId().getValue();
        userEntity.tenantId = user.getTenantId().getValue();
        userEntity.name = user.getName();
        userEntity.email = user.getEmail().getValue();
        userEntity.passwordHash = user.getPasswordHash() || null;
        userEntity.createdAt = user.getCreatedAt();
        userEntity.updatedAt = user.getUpatedAt();

        // Save to database
        await this.userRepository.save(userEntity);

        return user;
    }

    async findById(tenantId: string, id: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOne({
            where: { id, tenantId },
        });

        if (!userEntity) {
            return null;
        }

        // Map database entity to domain entity
        return this.toDomain(userEntity);
    }

    async findByEmail(tenantId: string, email: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOne({
            where: { email, tenantId },
        });

        if (!userEntity) {
            return null;
        }

        return this.toDomain(userEntity);
    }

    async findAll(tenantId: string): Promise<User[]> {
        const userEntities = await this.userRepository.find({
            where: { tenantId },
        });

        return userEntities.map((entity) => this.toDomain(entity));
    }

    async delete(tenantId: string, id: string): Promise<void> {
        await this.userRepository.delete({ id, tenantId });
    }

    /**
     * Maps database entity to domain entity
     */
    private toDomain(userEntity: UserEntity): User {
        return new User(
            new userId(userEntity.id),
            new TenantId(userEntity.tenantId),
            userEntity.name,
            new Email(userEntity.email),
            userEntity.createdAt,
            userEntity.updatedAt,
            userEntity.passwordHash || undefined,
        );
    }
}
