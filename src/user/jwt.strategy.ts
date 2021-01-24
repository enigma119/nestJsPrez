import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.model';
import { Request } from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        // Constructors for derived classes must contain a 'super' call
        super({
            jwtFromRequest: (req: Request) => {
                console.log('authorization', req)
                let token;
                if (req && req.headers) {
                  token = req.headers.authorization;
                }
                console.log('token from jwt strategy', token)
                return token;
              },
            ignoreExpiration: false,
            secretOrKey: 'bayiAdouna1ggggggg#',
          });
    }

    // the following method have to exist in every startegy and ave to be named "validate"
    async validate(payload: JwtPayload) {
        console.log('executed payload')
        const { email } = payload
        const user = await this.userModel.findOne({ email });
        // console.log('user === ', user)
        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }

    /* Nest step is to export JwtStrategy to userModule Provider and there , export it with also PassPortModule */
}
