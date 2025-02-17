import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateCertificateDto {
  @IsString()
  @MinLength(1)
  certificateCode: string;

  @IsInt()
  certificateTypeId: number;

  @IsInt()
  patientId: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  issueDate?: Date;

  @IsInt()
  @IsOptional()
  restDays?: number;
}
