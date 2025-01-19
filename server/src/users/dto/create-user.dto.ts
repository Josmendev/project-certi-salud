import { IsNumberString, IsString, Length } from "class-validator";
import { Staff } from "src/staff/entities/staff.entity";

export class CreateUserDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;

  staff: Staff;
}
