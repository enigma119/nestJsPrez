import { Body, Controller, HttpStatus, Post, Res, UnauthorizedException, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthCredentialsDto } from 'src/user/dto/auth-credentials.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private AuthService: AuthService) {}

    @Post('/singup')
    @UsePipes(ValidationPipe) //we imported usePipe to appy validation for our createUserDto
    @UseInterceptors(FileInterceptor('profilePicture', {dest: '/opt/data/files/keurDocteur/profilePic'}))
    async sinUp(@Res() res, @Body() createUserDto: CreateUserDto, @UploadedFile() profilePicture ) {
        createUserDto.createdAt = new Date()
        if(profilePicture) {
            createUserDto.profilePicture = profilePicture.filename
        }
        
        await this.AuthService.singUp(createUserDto)
        return res.status(HttpStatus.OK).json({
            message: "User has been created successfully",
        })
    }   


    @Post('/singin')
    async singIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto ) {
       const token =  await this.AuthService.singIn(authCredentials)
       if(!token) {
           throw new UnauthorizedException('Invalid credentials')
       }
       return token
    }

}
