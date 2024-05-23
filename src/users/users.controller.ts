import { Controller, Get, Param, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get('tasks')
  getUserTasks(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15) {
    return this.usersService.paginateUserTasks(request['user'], +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
