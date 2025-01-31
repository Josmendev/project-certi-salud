import { IsString, Length } from "class-validator";

export class CreateCertificateTypeDto {
  @IsString()
  @Length(1, 20)
  description: string;
}
