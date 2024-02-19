import { Column, Entity, OneToMany } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Challenge } from './challenge.entity';

@Entity()
export class ChallengeGroup extends BasePkEntity {
  @Column({ nullable: false })
  title: string;

  //Links
  @OneToMany((type) => Challenge, (challenge) => challenge.challengeGroup)
  challenges: Challenge[];
}
