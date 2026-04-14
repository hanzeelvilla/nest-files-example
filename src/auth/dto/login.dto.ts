import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'The password must have an uppercase letter, a lowercase letter, a number, and a special character (symbol)',
  })
  password!: string;
}
