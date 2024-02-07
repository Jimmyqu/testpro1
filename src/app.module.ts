import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        // 指定文件存储目录
        destination: path.join(__dirname, '../uploads'), // 通过时间戳来重命名上传的文件名
        filename: (_, file, callback) => {
          const fileName = `${
            new Date().getTime() + path.extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
