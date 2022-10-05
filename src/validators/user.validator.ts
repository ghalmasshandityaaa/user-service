import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UserValidator {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;


  @IsNotEmpty()
  @IsString()
  fullname: string;
}