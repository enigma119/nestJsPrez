import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';

@Module({
  controllers: [AppointmentController]
})
export class AppointmentModule {}
