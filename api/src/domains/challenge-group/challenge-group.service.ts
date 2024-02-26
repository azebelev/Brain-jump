import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengeGroup } from 'src/persistence/entities/challengeGroup.entity';
import { ChallengeGroupClosure } from 'src/persistence/entities/challengeGroupClosure.entity';
import { TreeManager } from 'src/persistence/managers/treeManager';
import { Repository, TreeRepository } from 'typeorm';
import { CreateChallengeGroupDto } from './dto/create-challenge-group.dto';
import { UpdateChallengeGroupDto } from './dto/update-challenge-group.dto';

@Injectable()
export class ChallengeGroupService {
  private readonly treeRepo: TreeRepository<ChallengeGroup>;
  constructor(
    @InjectRepository(ChallengeGroup)
    private readonly challengeGroupRepo: Repository<ChallengeGroup>,
  ) {
    this.treeRepo =
      challengeGroupRepo.manager.getTreeRepository(ChallengeGroup);
  }

  async create(dto: CreateChallengeGroupDto) {
    const newGroup = this.challengeGroupRepo.create(dto);
    if (dto.parentId) {
      const parent = await this.challengeGroupRepo.findOneBy({
        id: dto.parentId,
      });
      if (!parent) throw new NotFoundException('Parent of group is not found');
      newGroup.parent = parent;
    }
    return await this.challengeGroupRepo.save(newGroup);
  }

  async findAll() {
    return await this.treeRepo.findTrees();
  }

  async findOne(id: number, depth?: number) {
    const challengeGroup = await this.challengeGroupRepo.findOne({
      where: { id },
    });
    return await this.treeRepo.findDescendantsTree(
      challengeGroup,
      depth ? { depth } : undefined,
    );
  }

  async update(id: number, dto: UpdateChallengeGroupDto) {
    if (dto.parentId !== undefined) {
      return await this.challengeGroupRepo.manager.transaction(
        async (manager) => {
          const groupRepo = manager.getRepository(ChallengeGroup);
          const treeRepo = manager.getTreeRepository(ChallengeGroup);
          const closureRepo = manager.getRepository(ChallengeGroupClosure);
          const treeManager = new TreeManager(groupRepo, treeRepo, closureRepo);

          await treeManager.justifyTree(id, dto.parentId);
          return await groupRepo.update(id, dto);
        },
      );
    } else {
      return await this.challengeGroupRepo.update(id, dto);
    }
  }

  async remove(id: number) {
    return await this.challengeGroupRepo.manager.transaction(
      async (manager) => {
        const groupRepo = manager.getRepository(ChallengeGroup);
        const closureRepo = manager.getRepository(ChallengeGroupClosure);
        const treeRepo = manager.getTreeRepository(ChallengeGroup);
        const treeManager = new TreeManager(groupRepo, treeRepo, closureRepo);

        await treeManager.deleteWithDescendants(id);
      },
    );
  }
}
