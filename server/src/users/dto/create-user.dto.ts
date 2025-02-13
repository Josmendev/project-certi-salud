import { IsArray, IsNumberString, Length } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';
import { Staff } from 'src/staff/entities/staff.entity';

export class CreateUserDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;

  staff: Staff;

  @IsArray()
  role?: Role[];
}
