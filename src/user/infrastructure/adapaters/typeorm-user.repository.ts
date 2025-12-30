import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../application/ports';
import { User } from '../../domain/entities';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserEntity } from './user.orm-entity';

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
        const userEntity = this.toOrm(user);

        // Save to database
        await this.userRepository.save(userEntity);

        return user;
    }

    async findById(id: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOne({ where: { id } });

        if (!userEntity) {
            return null;
        }

        // Map database entity to domain entity
        return this.toDomain(userEntity);
    }

    async findByEmail(email: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOne({ where: { email } });

        if (!userEntity) {
            return null;
        }

        return this.toDomain(userEntity);
    }

    async findAll(): Promise<User[]> {
        const userEntities = await this.userRepository.find();

        return userEntities.map((entity) => this.toDomain(entity));
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    /**
     * Maps database entity to domain entity
     */
    private toDomain(userEntity: UserEntity): User {
        return UserFactory.rehydrate({
            id: userEntity.id,
            name: userEntity.name,
            email: userEntity.email,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
        });
    }

    /**
     * Maps domain entity to database entity
     */
    private toOrm(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.id = user.getId().getValue();
        userEntity.name = user.getName();
        userEntity.email = user.getEmail().getValue();
        userEntity.createdAt = user.getCreatedAt();
        userEntity.updatedAt = user.getUpatedAt();

        return userEntity;
    }
}
