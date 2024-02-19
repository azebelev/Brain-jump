import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Brain jump api')
  .setDescription('API')
  .setVersion('1.0')
  .addTag('challenges')
  .build();
