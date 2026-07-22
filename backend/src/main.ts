import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://filo-res.netlify.app',
      'https://filo-res-38hr-eight.vercel.app',
      'https://filo-res.vercel.app',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
