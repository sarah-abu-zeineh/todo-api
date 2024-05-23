import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://181076:pyys2zOJoUDQCDFt@saz.wnpqbd4.mongodb.net/'),
    UsersModule,
    UploadModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
