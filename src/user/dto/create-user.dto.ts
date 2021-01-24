import { IsLowercase, IsNotEmpty, IsEmail, IsString, MinLength, Matches   } from 'class-validator'
import { CustomerTypeEnum, GenderEnum, RoleEnum } from '../user.model';


export class CreateUserDto {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    gender: GenderEnum;

    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsLowercase()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsString()
    @MinLength(5)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{ message: 'Password too weak' })
    password: string;

    salt: string;

    @IsNotEmpty()
    customerType: CustomerTypeEnum;

    @IsNotEmpty()
    role: RoleEnum;

    isActive: boolean;

    profilePicture: string;
    createdAt: Date;
    updatedAt: Date

}