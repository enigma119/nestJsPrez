import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from './user.model';
import { LocalStrategy } from './local.strategy';
// const passportModule = PassportModule.register({ defaultStrategy: 'local' });


@Module({

  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'bayiAdouna1ggggggg#',
      signOptions: {
        expiresIn: '1h',
        algorithm: 'HS384',
      }, verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [UserController],
  providers: [ UserService, AuthService, LocalStrategy, JwtStrategy],
  exports: [
    AuthService
  ]
   // we exported these 2 to resuse them for guard in route handler
})
export class UserModule {}
