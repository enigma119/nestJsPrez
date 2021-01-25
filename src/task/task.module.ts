import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './task.model';


@Module({
  // create an import for mongoose
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])
  ],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule { }
