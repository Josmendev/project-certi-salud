import { SeedPerson } from './seed-person.interface';

export interface SeedPatient extends SeedPerson {
  age: number;
}
