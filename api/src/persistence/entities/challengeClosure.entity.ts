import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity()
export class ChallengeClosure {
  @PrimaryColumn()
  id_ancestor: number;

  @PrimaryColumn()
  id_descendant: number;
}
