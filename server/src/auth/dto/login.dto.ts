import { IsNumberString, IsString, Length } from "class-validator";

export class LoginDto {

  @IsNumberString()
  @Length(8, 8)
  username: string;

  @IsString()
  @Length(6, 50)
  password: string;
}