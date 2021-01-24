import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt'
import { User } from './user.model'
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from '@nestjs/jwt';

const jwt = require('jsonwebtoken');
const fs = require('fs');


@Injectable()
export class AuthService {
    authCredentials: AuthCredentialsDto

    PUB_KEY = fs.readFileSync(process.env.PUB_KEY_PATH, 'utf8');
    PRIV_KEY = fs.readFileSync(process.env.PRI_KEY_PATH, 'utf8');

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>, 
        private jwtService: JwtService
        ) { 
             
        }

    async singUp(registrationData: CreateUserDto): Promise<void> {
 
        const { email, password} = registrationData
        const exist = await this.userModel.findOne({ email })

        if(exist) {
            throw new ConflictException('User already exist')
        }

        registrationData.salt = await bcrypt.genSalt();
        registrationData.password = await this.hashPassword(password, registrationData.salt)

        var user = new this.userModel(registrationData)
        await user.save()
    }

    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }



    async singIn(authCredentials: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {email, password} = authCredentials
        const user = await this.userModel.findOne({email})
        

        if(user && await this.validatePassword(password, user.salt, user.password)) {
            const payload: JwtPayload = {email} //payload that will be signed

            // const accessToken = await this.jwtService.sign(payload) //jwt sing payload
            const accessToken = await jwt.sign({email, exp: Math.floor(Date.now() / 1000) + (60 * 60),}, this.PRIV_KEY, { algorithm: 'RS256'});
            // await this.validateToken(accessToken)
            return { accessToken }

        } else {
            return null
        }

        
        
    }


    async validatePassword(password: string, userSalt: string, userPassword): Promise<boolean> {
        const hash = await bcrypt.hash(password, userSalt)
        return hash === userPassword
    }

    async validateToken(token: string): Promise<string> {
        return jwt.verify(token, this.PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {
            if (!err) {
                 const email = payload.email;
                 return {email: email}
            } else {
                console.log(err);
                if (err.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Your token has expired');
                }
                  if (err.name === 'JsonWebTokenError') {
                      throw new UnauthorizedException('That JWT is malformed');
                  }
              }
          });
    }



    async verify(username: string, password: string) {
        
        username = this.authCredentials.email
        password = this.authCredentials.password

        const user = await this.userModel.findOne({email: username})
        

        if(user && await this.validatePassword(password, user.salt, user.password)) {
            return user 
        } else {
            return null
        }
    }

    // fetch a single user
    async getUserByEmail(email): Promise<User> {
        const user = await await this.userModel.findOne({email}, {password:0, salt:0, _v:0}).exec()
        // if there is no user with that id, notFoundexception is enought smarth to throw 404 error
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return user;
    }


}