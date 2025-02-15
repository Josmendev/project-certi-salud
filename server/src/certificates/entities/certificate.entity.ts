import { CertificateType } from 'src/certificate-types/entities/certificate-type.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { StatusCertificate } from '../enum/status-certificate.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';

@Entity({ name: 'certificate' })
export class Certificate extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  certificateId: string;

  @Column({
    name: 'certificate_code',
    type: 'varchar',
    unique: true,
    length: 18,
  })
  certificateCode: string;

  @ManyToOne(
    () => CertificateType,
    (certificateType) => certificateType.certificates,
  )
  @JoinColumn({
    name: 'certificate_type_id',
  })
  certificateType: CertificateType;

  @ManyToOne(() => Staff, (staff) => staff.certificates)
  @JoinColumn({
    name: 'staff_id',
  })
  staff: Staff;

  @ManyToOne(() => Patient, (patient) => patient.certificates)
  @JoinColumn({
    name: 'patient_id',
  })
  patient: Patient;

  @Column({
    name: 'issue_date',
    type: 'date',
  })
  issueDate?: Date;

  @Column({
    name: 'rest_days',
    type: 'int',
    nullable: true,
  })
  restDays?: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusCertificate,
    default: StatusCertificate.Completed,
  })
  status: StatusCertificate;
}
