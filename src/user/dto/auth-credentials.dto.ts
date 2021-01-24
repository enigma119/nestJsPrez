import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(50)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string


}