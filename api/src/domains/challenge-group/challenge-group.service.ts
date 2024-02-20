import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengeGroup } from 'src/persistence/entities/challengeGroup.entity';
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
    if (dto.parentId) await this.addParent(newGroup, dto.parentId);

    return await this.challengeGroupRepo.save(newGroup);
  }

  async findAll() {
    return await this.treeRepo.findTrees();
  }

  async findOne(id: number) {
    const challengeGroup = await this.challengeGroupRepo.findOne({
      where: { id },
    });
    return await this.treeRepo.findDescendantsTree(challengeGroup);
  }

  async update(id: number, dto: UpdateChallengeGroupDto) {
    if (dto.parentId) {
      return await this.challengeGroupRepo.manager.transaction(
        async (manager) => {
          const repo = manager.getRepository(ChallengeGroup);
          const treeRepo = manager.getTreeRepository(ChallengeGroup);
          const entityForUpdate = await repo.findOne({ where: { id } });
          const descendantsIds = (
            await treeRepo.findDescendants(entityForUpdate)
          ).map((v) => v.id);
          const parent = await repo.findOne({ where: { id: dto.parentId } });

          const oldAncestorsIds = (
            await treeRepo.findAncestors(entityForUpdate)
          )
            .map((v) => v.id)
            .filter((v) => v != id);
          const newAncestorsIds = (await treeRepo.findAncestors(parent)).map(
            (v) => v.id,
          );

          const outOfDateLinks = oldAncestorsIds.filter(
            (id) => !newAncestorsIds.includes(id),
          );
          const newLinks = newAncestorsIds.filter(
            (id) => !oldAncestorsIds.includes(id),
          );
          if (outOfDateLinks.length && descendantsIds.length) {
            const deleteQuery =
              'DELETE FROM challenge_group_closure ' +
              `WHERE id_ancestor IN (${outOfDateLinks.join(',')}) AND id_descendant IN (${descendantsIds.join(',')})`;
            await repo.manager.query(deleteQuery);
          }
          const newIds = descendantsIds
            .reduce(
              (p, c) => [...p, ...newLinks.map((id) => `(${id},${c})`)],
              [] as Array<string>,
            )
            .join(',');
          const insertQuery =
            'INSERT INTO challenge_group_closure (id_ancestor, id_descendant) VALUES' +
            newIds;

          await repo.manager.query(insertQuery);
          await repo.update(id, dto);

          return {
            oldAncestorsIds,
            newAncestorsIds,
            outOfDateLinks,
            newLinks,
            insertQuery,
          };
        },
      );
    } else {
      // return await this.challengeGroupRepo.update(id, dto);
    }
  }

  async remove(id: number) {
    return await this.challengeGroupRepo.manager.transaction(
      async (manager) => {
        const repo = manager.getRepository(ChallengeGroup);
        const treeRepo = manager.getTreeRepository(ChallengeGroup);

        const rootForDelete = await repo.findOne({ where: { id } });
        if (rootForDelete) {
          const children = await treeRepo.findDescendants(rootForDelete);
          const childrenIds = children.map((c) => c.id);
          // this (@) used for mssql in case of another db will be different
          const placeholders = childrenIds.map((_, i) => '@' + i).join(',');
          await repo.manager.query(
            'DELETE FROM challenge_group_closure ' +
              `WHERE id_ancestor IN (${placeholders}) OR id_descendant IN (${placeholders})`,
            childrenIds,
          );
          return await repo.delete(childrenIds);
        }
      },
    );
  }

  private async addParent(
    challengeGroup: ChallengeGroup,
    parentGroupId: number,
  ) {
    const parent = await this.challengeGroupRepo.findOneBy({
      id: parentGroupId,
    });
    if (!parent) throw new NotFoundException('parent of group is not found');
    challengeGroup.parent = parent;
  }
}
