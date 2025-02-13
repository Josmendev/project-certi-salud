import { IsNumberString, Length } from 'class-validator';

export class GetPersonByDniDto {
  @IsNumberString()
  @Length(8, 8)
  dni: string;
}
