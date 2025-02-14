import { IsInt, IsNumberString, Length, Min } from 'class-validator';

export class AssignPatientDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;

  @IsInt()
  @Min(1)
  age: number;
}
