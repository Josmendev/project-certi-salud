import { Certificate } from 'src/certificates/entities/certificate.entity';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'certificate_type' })
export class CertificateType extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'certificate_type_id',
  })
  certificateTypeId: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  description: string;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Certificate, (certificate) => certificate.certificateType)
  certificates: Certificate[];
}
