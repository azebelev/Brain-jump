import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getDbConfig } from './config/db.config';
import { ChallengesModule } from './domains/challenges/challenges.module';
import { UserModule } from './domains/user/user.module';
import { ChallengeGroupModule } from './domains/challenge-group/challenge-group.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ChallengesModule,
    ChallengeGroupModule,
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:getDbConfig
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
