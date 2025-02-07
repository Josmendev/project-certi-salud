import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'disease' })
export class Disease extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'disease_id',
  })
  diseaseId: number;

  @Column({
    name: 'cie_10',
    type: 'varchar',
    length: 8,
  })
  cie10: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 120,
  })
  description: string;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
