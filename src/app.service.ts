import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // 到这里其实文件已经上传到服务器本地了，需要有后续的存储需求，比如要上传到云存储服务中，可以在这里继续处理
    // 返回文件URL
    return `http://localhost:3000/uploads/${file.filename}`;
  }
}
