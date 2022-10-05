import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { ConfigModule } from './modules/config/config.module';
import { PrismaService } from './services/prisma.service';
import { UserService } from './services/user.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
