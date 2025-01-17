import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'role'})
export class Role {
  
  @PrimaryGeneratedColumn({
    name: 'role_id'
  })
  roleId: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false
  })
  description: string;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp' 
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}