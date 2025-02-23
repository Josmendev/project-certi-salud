import { Certificate } from 'src/certificates/entities/certificate.entity';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Person } from 'src/persons/entities/person.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'staff' })
export class Staff extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'staff_id',
  })
  staffId: number;

  @OneToOne(() => Person, (person) => person.staff)
  @JoinColumn({
    name: 'person_id',
  })
  person: Person;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.staff)
  users: User[];

  @OneToMany(() => Certificate, (certificate) => certificate.staff)
  certificates: Certificate[];
}
