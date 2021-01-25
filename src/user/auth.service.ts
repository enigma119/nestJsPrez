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
    ) { }

    async singUp(registrationData: CreateUserDto): Promise<void> {

        const { email, password } = registrationData
        const exist = await this.userModel.findOne({ email })

        if (exist) {
            throw new ConflictException('User already exist')
        }

        //generate
        registrationData.salt = await bcrypt.genSalt();
        registrationData.password = await this.hashPassword(password, registrationData.salt)

        var user = new this.userModel(registrationData)
        await user.save()
    }


    // hash Password with the generated unique Salt
    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }



    async singIn(authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredentials
        const user = await this.userModel.findOne({ email }) // verify if user exist

        // validate password
        if (user && await this.validatePassword(password, user.salt, user.password)) {
            const accessToken = await jwt.sign({ email, exp: Math.floor(Date.now() / 1000) + (60 * 60), }, this.PRIV_KEY, { algorithm: 'RS256' });
            return { accessToken }
            //folowing methos is for passport
            // const payload: JwtPayload = {email}
            // const accessToken = await this.jwtService.sign(payload) //jwt sing payload

        } else {
            return null
        }

    }

    // validate password by comparing hashes
    async validatePassword(password: string, userSalt: string, userPassword): Promise<boolean> {
        const hash = await bcrypt.hash(password, userSalt)
        return hash === userPassword
    }



    // Validate Token and send Result to the middleware
    async validateToken(token: string): Promise<string> {
        return jwt.verify(token, this.PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {
            if (!err) {
                const email = payload.email;
                return { email: email }
            } else {
                if (err.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Your token has expired');
                }
                if (err.name === 'JsonWebTokenError') {
                    throw new UnauthorizedException('That JWT is malformed');
                }
            }
        });
    }



    // Get User by email
    async getUserByEmail(email): Promise<User> {
        const user = await await this.userModel.findOne({ email }, { password: 0, salt: 0, _v: 0 }).exec()
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return user;
    }



    // passport verify User with email and passport
    async verify(username: string, password: string) {

        username = this.authCredentials.email
        password = this.authCredentials.password

        const user = await this.userModel.findOne({ email: username })

        if (user && await this.validatePassword(password, user.salt, user.password)) {
            return user
        } else {
            return null
        }
    }


}