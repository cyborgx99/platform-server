import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const error_messages = errors.map((error) =>
          Object.values(error.constraints),
        );
        return new BadRequestException(error_messages.toString());
      },
    }),
  );
  app.use(cookieParser());
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
}
bootstrap();
