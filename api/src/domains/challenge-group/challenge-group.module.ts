import { Module } from '@nestjs/common';
import { ChallengeGroupService } from './challenge-group.service';
import { ChallengeGroupController } from './challenge-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeGroup } from 'src/persistence/entities/challengeGroup.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ChallengeGroup])],
  controllers: [ChallengeGroupController],
  providers: [ChallengeGroupService],
})
export class ChallengeGroupModule {}
