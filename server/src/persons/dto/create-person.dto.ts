import {
  IsNumberString,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';
import { Staff } from '../../staff/entities/staff.entity';
import { Patient } from 'src/patients/entities/patient.entity';

export class CreatePersonDto {
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

  staff?: Staff;

  patient?: Patient;
}
