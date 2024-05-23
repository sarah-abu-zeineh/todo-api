import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (file) {
      console.log(`File uploaded: ${file.originalname}`);
    } else {
      console.log('No file uploaded.');
    }
  }
}
