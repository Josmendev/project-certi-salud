import { IsInt, Min } from 'class-validator';
import { Person } from 'src/persons/entities/person.entity';

export class PatientDataDto {
  @IsInt()
  @Min(1)
  age: number;

  person: Person;
}
