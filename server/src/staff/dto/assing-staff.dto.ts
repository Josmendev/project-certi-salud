import { IsNumberString, Length } from 'class-validator';

export class AssignStaffDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;
}
