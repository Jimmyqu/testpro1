import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/uploads',
    serveStatic(path.join(__dirname, '../uploads'), {
      maxAge: '1d',
      extensions: ['jpg', 'jpeg', 'png', 'gif'],
    }),
  );

  app.use(
    '/static',
    serveStatic(path.join(__dirname, '../static'), {
      maxAge: '1d',
      extensions: ['html'],
    }),
  );

  await app.listen(3000);
}
bootstrap();
