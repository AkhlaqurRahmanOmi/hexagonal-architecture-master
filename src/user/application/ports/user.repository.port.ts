import { User } from '../../domain/entities';

export interface UserRepositoryPort {
  save(user: User): Promise<User> | User;
  findById(tenantId: string, id: string): Promise<User | null> | User | null;
  findByEmail(tenantId: string, email: string): Promise<User | null> | User | null;
  findByEmailGlobal(email: string): Promise<User | null> | User | null;
  findAll(tenantId: string): Promise<User[]> | User[];
  delete(tenantId: string, id: string): Promise<void> | void;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
