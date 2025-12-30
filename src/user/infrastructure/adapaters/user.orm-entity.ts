import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * TypeORM Entity for User
 * This is the database representation of the User domain entity
 */
@Entity('users')
@Index(['tenantId', 'email'], { unique: true })
export class UserEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
    passwordHash?: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
