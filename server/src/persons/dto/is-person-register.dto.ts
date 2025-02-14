import { IsNumberString, Length } from 'class-validator';
import { TermRelationWithPerson } from '../enum/term-relation.enum';

export class IsPersonRegisterDto {
  @IsNumberString()
  @Length(8, 8)
  identityDocumentNumber: string;

  termRelation: TermRelationWithPerson;
}
