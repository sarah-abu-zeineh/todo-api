import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { Task } from 'src/schemas/task.schema';

@UseGuards(AuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  async search(@Req() request: Request, @Query('query') query: string, @Query('state') state: string) {
    return this.searchService.searchUserTasks(request['user'], query, state);
  }
}
