import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require ('dotenv')
dotenv.config({path: '/opt/keurDocteur/.env'})


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
