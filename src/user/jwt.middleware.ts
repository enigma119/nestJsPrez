
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { UserService } from './user.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    valid = null;
    decode = null;
    cleanToken = null;

    constructor(
        private authService: AuthService
    ) {

    }
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        try {
            this.cleanToken = token.replace('Bearer', '').trim();
            this.decode = this.authService.validateToken(this.cleanToken);
            if (this.decode) {
                this.decode.then(result => {
                    this.authService.getUserByEmail(result.email).then(found => {
                        // console.log('user', found)
                        delete found.password
                        req.user = found
                        next()
                    })
                })
            } else {
                next()
            }

        } catch (error) {
            console.log(error)
            next()
        }
        // next();
    }
}
