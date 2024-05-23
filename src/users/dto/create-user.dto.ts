import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(7)
    password: string

    userImg?: string;
}
