import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { StatusEnum, Task } from './task.model';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private taskService: TaskService) {
    }

    // Get all task
    @Get()
    getTasks(): Promise<Task[]> {
      return this.taskService.getAllTasks();
    }
  

    @Get('/:id')
    getTaskById(@Res() res, @Param('id') id) {
      const task = this.taskService.getTaskById(id)
      task.then(result => {
        //   console.log(result)
        return res.status(HttpStatus.OK).json(result)
      })
      .catch(err => {
        return res.status(HttpStatus.NOT_FOUND).json({
            message: "Task not found",
            task
        })
      })
      
    }
  

    // Create task
    @Post()
    @UsePipes(ValidationPipe) //for validation DTO data
    createTask(@Res() res, @Body() createTaskDTO: CreateTaskDto) {
        const task = this.taskService.createtask(createTaskDTO);
        return res.status(HttpStatus.OK).json({
            message: "Task has been created successfully",
            task
        })
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status') status: StatusEnum,
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status);
    }


    // Detele Task
    @Delete('/:id')
    deleteTask(@Param('id') id: string): Promise<void> {
      return this.taskService.deleteTask(id);
    }


    // enum validation with custom Pipe for updating Task
    
    // @Patch('/:id/status')
    // updateTaskStatus(
    //     @Param('id') id: string,
    //     @Body('status', new TaskStatusValidationPipe()) status: StatusEnum,
    // ): Promise<Task> {
    //     return this.taskService.updateTaskStatus(id, status);
    // }

}

