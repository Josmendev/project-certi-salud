import { BcryptAdapter } from "src/common/adapters/bcrypt.adapter";
import { Timestamped } from "src/common/entities/timestamped.entity";
import { Role } from "src/roles/entities/role.entity";
import { Staff } from "src/staff/entities/staff.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'user'})
export class User extends Timestamped {
  @PrimaryGeneratedColumn({
    name: 'user_id'
  })
  userId: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 8,
    unique: true
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 100
  })
  password: string;

  @Column({
    name: 'isConfirm',
    type: 'boolean',
    default: false
  })
  isConfirm: boolean;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 50
  })
  token: string;

  @Column({
    name: 'isActive',
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @ManyToOne(
    ()=> Staff,
    staff => staff.users
  )
  @JoinColumn({
    name: 'staff_id'
  })
  staff: Staff;
  
  @ManyToMany(
    () => Role,
    {eager:true}
  )
  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'userId'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'roleId'
    }
  })
  role: Role[]

  @BeforeInsert()
  async hashPassword() {
    const bcrypt = new BcryptAdapter();
    this.password = await bcrypt.hash(this.password);
  }

}
