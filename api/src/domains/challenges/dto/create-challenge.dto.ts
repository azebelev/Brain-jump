import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsNumber()
  challengeGroupId: number;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsNumber()
  authorId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
