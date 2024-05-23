import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { filter } from 'rxjs';
import { TaskState } from 'src/enums/taskState.enum';
import { Task } from 'src/schemas/task.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) { }

  async searchUserTasks(userData: string, searchTerm: string, state: string): Promise<Task[]> {
    const user = await this.userModel.findById(userData['id']).populate({
      path: 'tasks',
      model: this.taskModel,
    }).exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const regex = new RegExp(searchTerm, 'i');
    let filteredTasks = user.tasks.filter(task => regex.test(task.title) || regex.test(task.desc));
    
    console.log(state);
    if (state == TaskState.COMPLETED || state == TaskState.PENDING) {
      filteredTasks = filteredTasks.filter(task => task.status === state);
    }

    return filteredTasks;
  }
}
