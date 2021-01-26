import { Controller, Get, HttpStatus, Param, Req, Res} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../decorators/roles.decorator';

@Controller('user')
export class UserController {

    constructor( private userService: UserService ) { }


    @Get()
    @Roles('admin')
    async getUsers(@Req() req, @Res() res) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users)
    }


    @Get('/:userId')
    async getUserById(@Res() res, @Param('userId') userId) {
        const user = await this.userService.getUserbyId(userId)
        return res.status(HttpStatus.OK).json(user)
    }


}


