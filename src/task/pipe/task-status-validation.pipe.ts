import { BadRequestException, PipeTransform } from '@nestjs/common';
import { StatusEnum } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    StatusEnum.OPEN,
    StatusEnum.DONE,
    StatusEnum.INPROGRESS,
  ];

  transform(value: any): any {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status.toUpperCase());
    return idx !== -1;
  }
}