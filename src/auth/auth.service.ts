import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "../user/dto/create-user.dto";
import * as bcrypt from 'bcrypt'
import { User } from '../user/user.model'
import { AuthCredentialsDto } from "../user/dto/auth-credentials.dto";
const jwt = require('jsonwebtoken');
const fs = require('fs');


@Injectable()
export class AuthService {

    authCredentials: AuthCredentialsDto
    PUB_KEY = fs.readFileSync(process.env.PUB_KEY_PATH, 'utf8');
    PRIV_KEY = fs.readFileSync(process.env.PRI_KEY_PATH, 'utf8');

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }


    //SingUp funtion
    async singUp(registrationData: CreateUserDto): Promise<void> {
        const { email, password } = registrationData
        const exist = await this.userModel.findOne({ email })
        if (exist) {
            throw new ConflictException('User already exist')
        }

        registrationData.salt = await bcrypt.genSalt();
        registrationData.password = await this.hashPassword(password, registrationData.salt)

        var user = new this.userModel(registrationData)
        await user.save()
    }


    // hash Password with the generated unique Salt
    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }



    // SingIn function
    async singIn(authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredentials
        const user = await this.userModel.findOne({ email })

        // validate password
        if (user && await this.validatePassword(password, user.salt, user.password)) {
            const accessToken = await jwt.sign({ email, exp: Math.floor(Date.now() / 1000) + (60 * 60), }, this.PRIV_KEY, { algorithm: 'RS256' });
            return { accessToken }

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
    // this function is used by the middleware to get user Data that will we attached to the request
    async getUserByEmail(email): Promise<User> {
        const user = await await this.userModel.findOne({ email }, { password: 0, salt: 0, _v: 0 }).exec()
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return user;
    }


}
