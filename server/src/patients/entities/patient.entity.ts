import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Person } from 'src/persons/entities/person.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'patient' })
export class Patient extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'patient_id',
  })
  patientId: number;

  @OneToOne(() => Person, (person) => person.patient)
  @JoinColumn({
    name: 'person_id',
  })
  person: Person;

  @Column({
    name: 'age',
    type: 'integer',
  })
  age: number;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
