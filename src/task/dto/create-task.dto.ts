import { IsNotEmpty } from 'class-validator';
import { StatusEnum } from '../task.model';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  status: StatusEnum
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}