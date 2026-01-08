import { randomUUID } from 'node:crypto';

export class userId {
  private readonly value: string;
  constructor(id?: string) {
    this.value= id || randomUUID()
  }

  getValue(): string {
    return this.value;
  }


  equals(other: userId){
    return this.value === other.value;
  }
}