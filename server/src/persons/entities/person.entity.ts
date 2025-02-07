import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'person' })
export class Person extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'person_id',
  })
  personId: number;

  @Column({
    name: 'identity_document_number',
    type: 'varchar',
    length: 8,
    unique: true,
    nullable: false,
  })
  identityDocumentNumber: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'paternal_surname',
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  paternalSurname: string;

  @Column({
    name: 'maternal_surname',
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  maternalSurname: string;

  @OneToOne(() => Staff, (staff) => staff.person)
  staff: Staff;

  @OneToOne(() => Patient, (patient) => patient.person)
  patient: Patient;
}
