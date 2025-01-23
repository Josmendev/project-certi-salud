import { IsNumberString, IsString, Length } from "class-validator";

export class SignInDto {

  @IsNumberString()
  @Length(8, 8)
  username: string;

  @IsString()
  @Length(6, 50)
  password: string;
}