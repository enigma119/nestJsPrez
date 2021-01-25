import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentModule } from './appointment/appointment.module';
import { JwtMiddleware } from './user/jwt.middleware';
import { TaskModule } from './task/task.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './user/guards/roles.guard';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/keurdocteur-dev'), UserModule,  AppointmentModule, TaskModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
})
// export class AppModule {}

// to implement middleware

export class AppModule 
implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
  }
