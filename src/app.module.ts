import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtMiddleware } from './auth/jwt.middleware';
import { TaskModule } from './task/task.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb://localhost/keurdocteur-dev'), UserModule, TaskModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})


// implement middleware

export class AppModule
  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/auth/singin', method: RequestMethod.POST },
        { path: '/auth/singup', method: RequestMethod.POST })
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
