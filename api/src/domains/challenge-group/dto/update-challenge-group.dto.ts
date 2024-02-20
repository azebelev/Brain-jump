import { PartialType } from '@nestjs/swagger';
import { CreateChallengeGroupDto } from './create-challenge-group.dto';

export class UpdateChallengeGroupDto extends PartialType(CreateChallengeGroupDto) {}
