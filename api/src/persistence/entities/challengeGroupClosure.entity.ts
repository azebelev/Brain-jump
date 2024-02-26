import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ChallengeGroupClosure {
  @PrimaryColumn()
  id_ancestor: number;

  @PrimaryColumn()
  id_descendant: number;
}
