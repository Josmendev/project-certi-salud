import { IsNumberString, IsString, Length, Min, MinLength } from "class-validator";

export class CreateStaffDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  paternalSurname: string;

  @IsString()
  @MinLength(1)
  maternalSurname: string;
}
