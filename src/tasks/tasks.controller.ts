import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    return this.tasksService.createTask(createTaskDto, request['user']);
  }

  // @Get()
  // findAll() {
  //   return this.tasksService.findAll();
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.tasksService.removeTask(id, request['user']);
  }
}
