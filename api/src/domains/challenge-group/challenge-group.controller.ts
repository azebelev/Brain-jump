import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChallengeGroupService } from './challenge-group.service';
import { CreateChallengeGroupDto } from './dto/create-challenge-group.dto';
import { UpdateChallengeGroupDto } from './dto/update-challenge-group.dto';

@Controller('challenge-group')
export class ChallengeGroupController {
  constructor(private readonly challengeGroupService: ChallengeGroupService) {}

  @Post()
  create(@Body() createChallengeGroupDto: CreateChallengeGroupDto) {
    return this.challengeGroupService.create(createChallengeGroupDto);
  }

  @Get()
  findAll() {
    return this.challengeGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallengeGroupDto: UpdateChallengeGroupDto) {
    return this.challengeGroupService.update(+id, updateChallengeGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengeGroupService.remove(+id);
  }
}
