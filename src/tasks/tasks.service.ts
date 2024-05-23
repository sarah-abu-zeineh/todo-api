import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      const taskResponse: TaskResponse = {
        status: 'success',
        statusCode: 201,
        task: newTask
      }

      return taskResponse;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }


  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto): Promise<TaskResponse> {
    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, { new: true })
        .orFail();

      const taskResponse: TaskResponse = {
        status: 'OK',
        statusCode: 200,
        task: updatedTask
      };

      return taskResponse;
    } catch (exception) {
      throw new NotFoundException(`Task with ID ${taskId} not found`)
    }
  }

  async removeTask(taskId: string, user) {
    try {
      await this.userModel.findByIdAndUpdate(user.id, { $pull: { tasks: taskId } }).orFail();
      await this.taskModel.findByIdAndDelete(taskId).orFail();

      return "Task deleted Successfully";
    } catch (exception) {
      throw new NotFoundException('Task Not Found');
    }
  }
}
