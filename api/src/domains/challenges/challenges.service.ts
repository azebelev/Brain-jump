import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from 'src/persistence/entities/challenge.entity';
import { ChallengeClosure } from 'src/persistence/entities/challengeClosure.entity';
import { TreeManager } from 'src/persistence/managers/treeManager';
import { Repository, TreeRepository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  private readonly treeRepo: TreeRepository<Challenge>;
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepo: Repository<Challenge>,
  ) {
    this.treeRepo = challengeRepo.manager.getTreeRepository(Challenge);
  }

  async create(dto: CreateChallengeDto) {
    const newGroup = this.challengeRepo.create(dto);
    if (dto.parentId) {
      const parent = await this.challengeRepo.findOneBy({
        id: dto.parentId,
      });
      if (!parent) throw new NotFoundException('Parent is not found');
      newGroup.parent = parent;
      newGroup.challengeGroupId = null;
    }
    return await this.challengeRepo.save(newGroup);
  }

  async findAll() {
    return await this.treeRepo.findTrees();
  }

  async findOne(id: number, depth?: number) {
    const challengeGroup = await this.challengeRepo.findOne({
      where: { id },
    });
    return await this.treeRepo.findDescendantsTree(
      challengeGroup,
      depth ? { depth } : undefined,
    );
  }

  async update(id: number, dto: UpdateChallengeDto) {
    if(dto.challengeGroupId) dto.parentId = null;
    if (dto.parentId !== undefined) {
      return await this.challengeRepo.manager.transaction(async (manager) => {
        const groupRepo = manager.getRepository(Challenge);
        const treeRepo = manager.getTreeRepository(Challenge);
        const closureRepo = manager.getRepository(ChallengeClosure);
        const treeManager = new TreeManager(groupRepo, treeRepo, closureRepo);

        await treeManager.justifyTree(id, dto.parentId);
        return await groupRepo.update(id, dto);
      });
    } else {
      return await this.challengeRepo.update(id, dto);
    }
  }

  async remove(id: number) {
    return await this.challengeRepo.manager.transaction(async (manager) => {
      const groupRepo = manager.getRepository(Challenge);
      const closureRepo = manager.getRepository(ChallengeClosure);
      const treeRepo = manager.getTreeRepository(Challenge);
      const treeManager = new TreeManager(groupRepo, treeRepo, closureRepo);

      await treeManager.deleteWithDescendants(id);
    });
  }
}
