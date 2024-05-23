import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://181076:pyys2zOJoUDQCDFt@saz.wnpqbd4.mongodb.net/'),
    UsersModule,
    UploadModule,
    FileModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      useClass: AuthGuard,
      provide: APP_GUARD
    }
  ],
})

export class AppModule { }
