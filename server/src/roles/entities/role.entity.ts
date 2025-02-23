import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role' })
export class Role extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'role_id',
  })
  roleId: number;

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
}
