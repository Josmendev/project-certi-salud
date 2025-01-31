import { IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsArray()
  role?: number[];
}
