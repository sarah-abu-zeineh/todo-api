import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { FileService } from 'src/file/file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly fileService: FileService
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

  findAll() {
    return `This action returns all users`;
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
