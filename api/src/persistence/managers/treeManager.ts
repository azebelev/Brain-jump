import { BadRequestException } from '@nestjs/common';
import { In, Repository, TreeRepository } from 'typeorm';
type Target<T> = { type: T; name: string };
type TargetWithId<T> = { id?: number } & Target<T>;
type TargetForClosure<T> = {
  id_ancestor: number;
  id_descendant: number;
} & Target<T>;

export class TreeManager<E extends { id: number }, C> {
  private readonly entityRepo: Repository<E>;
  private readonly treeRepo: TreeRepository<E>;
  private readonly closureRepo: Repository<C>;

  constructor(
    entityRepo: Repository<E>,
    treeRepo: TreeRepository<E>,
    closureRepo: Repository<C>,
  ) {
    this.entityRepo = entityRepo;
    this.treeRepo = treeRepo;
    this.closureRepo = closureRepo;
  }

  async justifyTree(id: number, parentId: number) {
    if (id === parentId)
      throw new BadRequestException(
        'Moving of object inside off self is not allowed',
      );
    const updatedEntity = await this.entityRepo.findOne({
      where: { id } as any,
    });

    const descendantsIds = (
      await this.treeRepo.findDescendants(updatedEntity)
    ).map((v) => v.id);

    if (descendantsIds.includes(parentId))
      throw new BadRequestException(
        'Moving of object inside off self is not allowed',
      );

    const oldAncestorsIds = (await this.treeRepo.findAncestors(updatedEntity))
      .map((v) => v.id)
      .filter((v) => v != id);

    if (parentId !== null) {
      if (oldAncestorsIds.length && descendantsIds.length) {
        return await this.closureRepo.delete({
          id_ancestor: In(oldAncestorsIds),
          id_descendant: In(descendantsIds),
        } as any);
      }
    } else {
      const parent = await this.entityRepo.findOne({
        where: { id: parentId } as any,
      });

      const newAncestorsIds = (await this.treeRepo.findAncestors(parent)).map(
        (v) => v.id,
      );

      const outOfDateParentIds = oldAncestorsIds.filter(
        (id) => !newAncestorsIds.includes(id),
      );
      const newParentIds = newAncestorsIds.filter(
        (id) => !oldAncestorsIds.includes(id),
      );

      if (outOfDateParentIds.length && descendantsIds.length) {
        await this.closureRepo.delete({
          id_ancestor: In(outOfDateParentIds),
          id_descendant: In(descendantsIds),
        } as any);
      }

      const newClosureEntities = descendantsIds.reduce(
        (p, c) => [
          ...p,
          ...newParentIds.map((id) => ({
            id_ancestor: id,
            id_descendant: c,
          })),
        ],
        [] as Array<any>,
      );
      await this.closureRepo.insert(newClosureEntities);
    }
  }

  async deleteWithDescendants(id: number) {
    const rootForDelete = await this.entityRepo.findOne({
      where: { id } as any,
    });
    if (rootForDelete) {
      const descendants = await this.treeRepo.findDescendants(rootForDelete);
      const idsForDelete = descendants.map((c) => c.id);
      await this.closureRepo
        .createQueryBuilder()
        .delete()
        .where('id_ancestor IN (:...ids) OR id_descendant IN (:...ids)', {
          ids: idsForDelete,
        })
        .execute();
      return await this.entityRepo.delete(idsForDelete);
    } else
      return {
        affected: 0,
      };
  }
}
