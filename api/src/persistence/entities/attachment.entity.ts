import { Column, Entity, OneToOne } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Challenge } from './challenge.entity';

@Entity()
export class Attachment extends BasePkEntity {
  @Column()
  video: string;

  @Column()
  file: string;

  //Links
  @OneToOne((type) => Challenge, (challenge) => challenge.attachment)
  challenge: Challenge;
}
