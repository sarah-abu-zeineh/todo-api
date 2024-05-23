import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from 'src/schemas/task.schema';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { TaskResponse } from 'src/interface/taskResponce.interface';
import { response } from 'express';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,

  ) { }

  async createTask(createTaskDto: CreateTaskDto, user): Promise<TaskResponse> {
    try {
      const newTask = await new this.taskModel(createTaskDto).save();

      await this.userModel.findByIdAndUpdate(user.id, { $push: { tasks: newTask._id } });
      const taskResponse: TaskResponse= {
        status: 'success',
        statusCode: 201,
        task: newTask
      }

      return taskResponse;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
