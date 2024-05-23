import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/schemas/user.schema';
import { UploadModule } from 'src/upload/upload.module';
import { FileService } from 'src/file/file.service';
import { Task, TaskSchema } from 'src/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema }
    ]),
    UploadModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, FileService],
  exports: [UsersService]
})
export class UsersModule { }
