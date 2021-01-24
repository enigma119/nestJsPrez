import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.model';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService,
        private AuthService: AuthService
    ) { }

    @Get()
    async getAllUsers(@Res() res) {
        const users = await this.userService.getAllUsers();
        return res.status(HttpStatus.OK).json(users)
    }

    @Get('/:userId')
    async getSingleUser(@Res() res, @Param('userId') userId) {
        const user = await this.userService.getSingleUser(userId)
        return res.status(HttpStatus.OK).json(user)
    }

    @Post('/singup')
    @UsePipes(ValidationPipe) //we imported usePipe to appy validation in our createUserDto
    @UseInterceptors(FileInterceptor('profilePicture', {dest: '/opt/data/files/keurDocteur/profilePic'}))
    async creatUser(@Res() res, @Body() createUserDto: CreateUserDto, @UploadedFile() profilePicture ) {
        createUserDto.createdAt = new Date()
        createUserDto.profilePicture = profilePicture.filename
        
        const user = await this.userService.createUser(createUserDto)
        return res.status(HttpStatus.OK).json({
            message: "User has been created successfully",
            user
        })
    }   


    @Post('/singin')
    async singin(@Body(ValidationPipe) authCredentials: AuthCredentialsDto ) {
       const user =  await this.AuthService.singIn(authCredentials)
       if(!user) {
           throw new UnauthorizedException('Invalid credentials')
       }
       console.log(user)
       return user
    }

    @Post('/test')
    // @UseGuards(AuthGuard('local'))
    test(@Req() req) {
        console.log('return user from controler  ==> ',req.user
        )
    }
}

