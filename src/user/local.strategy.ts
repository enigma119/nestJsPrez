import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
      super({ usernameField: 'email' });
      console.log('from- local')
    }

    // the following method have to exist in every startegy and ave to be named "validate"
    async validate(username: string, password: string): Promise<any> {
        console.log('tested')
        const user = await this.authService.verify(username, password);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      }

    /* Nest step is to export JwtStrategy to userModule Provider and there , export it with also PassPortModule */
}
