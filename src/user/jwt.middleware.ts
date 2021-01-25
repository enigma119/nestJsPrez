
import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    decodedToken = null;
    requestToken = null;

    constructor(
        private authService: AuthService
    ) {

    }
    use(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            try {
                this.requestToken = token.replace('Bearer', '').trim();
                this.decodedToken = this.authService.validateToken(this.requestToken);
                this.decodedToken.then(result => {
                    this.authService.getUserByEmail(result.email).then(found => {
                        delete found.password
                        //attach user information to req.user
                        req.user = found
                        next()
                    })
                }).catch(err => {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        message: err.message
                    })
                })

            } catch (error) {
                console.log(error)
                next()
            }
        } else {
            next()
        }

    }
}
