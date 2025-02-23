import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsOptional } from 'class-validator';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';
export class CreateCertificateDto extends CreatePatientDto {
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
