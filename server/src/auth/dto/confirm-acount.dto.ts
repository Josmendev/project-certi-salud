import { Equals, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class ConfirmAccountDto {

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have an uppercase letter, a lowercase letter, and a number'
  })
  newPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have an uppercase letter, a lowercase letter, and a number'
  })
  repeatPassword: string;
}