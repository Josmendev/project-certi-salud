import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';
export class CreateCertificateDto extends CreatePatientDto {
  @IsString()
  @MinLength(1)
  certificateCode: string;

  @IsInt()
  certificateTypeId: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  issueDate?: Date;

  @IsInt()
  @IsOptional()
  restDays?: number;

  @IsArray()
  @IsOptional()
  diseases?: number[];
}
