import { ConflictException, Injectable } from '@nestjs/common';
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
    const userExist = await this.userModel.findOne({ email: createUserDto.email });

    if (userExist) {
      throw new ConflictException('User with this email already exists');
    };

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
