import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const fileUrl = await this.appService.uploadFile(file);
    return { url: fileUrl };
  }
}
