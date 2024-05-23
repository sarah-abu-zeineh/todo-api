import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskState } from 'src/enums/taskState.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsEnum(TaskState)
  @IsOptional()
  status?: TaskState = TaskState.PENDING;
}
