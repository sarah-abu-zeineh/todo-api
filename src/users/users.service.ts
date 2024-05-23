import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { Pagination } from 'src/interface/pagination.interface';
import { Task } from 'src/schemas/task.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<User>,
    private readonly fileService: FileService,
  ) { }

  async create(createUserDto: CreateUserDto, image: Express.Multer.File | undefined) {
    let imageName: string;

    if (image) {
      imageName = this.fileService.generateProfileImageName(createUserDto.name);
      this.fileService.uploadUserImage(imageName, image.buffer);
    } else {
      const defaultFileName: string = "default.jpeg";

      imageName = defaultFileName;
    }

    createUserDto.userImg = imageName;
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async paginateUserTasks(userData, page: number = 1, limit: number = 15) {
    const user = await this.userModel.findById(userData.id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const totalItems = user.tasks.length;
    const totalPages = Math.ceil(totalItems / limit) + 1;

    await user.populate({
      path: 'tasks',
      model: this.taskModel,
      options: {
        skip: (page - 1) * limit,
        limit: limit
      }
    });
    const items = user.tasks;

    return {
      items,
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: page,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(userEmail: string): Promise<User> {
    const userData = await this.userModel.findOne({ email: userEmail });

    return userData;
  }

  async checkUserExistence(userEmail: string): Promise<boolean> {
    const userData = await this.userModel.findOne({ email: userEmail });

    return userData ? true : false;
  }
}
