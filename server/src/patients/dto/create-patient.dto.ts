import { IsInt, Min } from "class-validator";
import { CreatePersonDto } from "src/persons/dto/create-person.dto";

export class CreatePatientDto extends CreatePersonDto{
  @IsInt()
  @Min(1)
  age?: number;
}
