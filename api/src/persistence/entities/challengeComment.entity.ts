import { Column, Entity, ManyToOne } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Challenge } from './challenge.entity';

@Entity()
export class ChallengeComment extends BasePkEntity {
  @Column({ nullable: false })
  comment: string;

  //Links
  @ManyToOne((type) => Challenge, (challenge) => challenge.comments)
  challenge: Challenge;
}
