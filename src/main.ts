import { Logger, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';
import { ApplicationContext } from './app.context';
import { ConfigService } from './modules/config/config.service';

async function bootstrap() {
  const app = await ApplicationContext();

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(app.get(ConfigService).getInt('APP_PORT'));
  Logger.log(
    `Running on port: ${app.get(ConfigService).getInt('APP_PORT')}`,
    'NestApplication',
  );
}
bootstrap();
