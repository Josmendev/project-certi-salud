import { IsNumberString, Length } from "class-validator";
import { TermRelation } from "../enum/term-relation.enum";

export class IsPersonRegisterDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;

  termRelation: TermRelation;
}