import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  uploadUserImage(fileName: string, fileBuffer: Buffer) {
    const userImagePath = join('src', 'uploads', 'profileImages', fileName);

    fs.writeFileSync(userImagePath, fileBuffer);
  }

  getDefaultImageName(): string {
    return 'default.jpeg';
  }

  generateProfileImageName(userName: string): string {
    const timestamp = Date.now();
    return `${userName}-${timestamp}.jpeg`;
  }
}
