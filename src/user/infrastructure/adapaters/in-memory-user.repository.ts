import { UserRepositoryPort } from '../../application/ports';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort{
  private readonly users: Map<string, User> = new Map();

  async save(user: User) {
    this.users.set(user.getId().getValue(), user)
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? user : null;
  }

  async findByEmail( email:string) : Promise<User | null> {
    const users = Array.from(this.users.values())
    return users.find((user)=> user.getEmail().getValue()===email) || null;
  }

  async findAll() {
    return Array.from(this.users.values());
  }

  async delete(id: string){
    this.users.delete(id)
  }
}