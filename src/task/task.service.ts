import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { StatusEnum, Task } from './task.model'
import { CreateTaskDto } from './dto/create-task.dto';



@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {
    }

    async createtask(createTaskDTO: CreateTaskDto): Promise<Task> {
        let { createdAt } = createTaskDTO
        createdAt = new Date()
        const task = new this.taskModel(createTaskDTO);
        return await task.save();
    }

    // Get All Task 
    async getAllTasks(): Promise<Task[]> {
        const tasks = this.taskModel.find().exec()
        return tasks
    }


    //Get Single Task
    async getTaskById(id): Promise<Task> {
        
        const task = await this.taskModel.findById(id)

        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return  task;
    }

    //delete task by ID
    async deleteTask(id: string): Promise<void> {
        const result = await this.taskModel.deleteOne({_id: id});
        console.log('deletedTask', result)
        if (result.deletedCount === 0) {
          throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }


    //update task status
    async updateTaskStatus(id: string, status: StatusEnum): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }


}
