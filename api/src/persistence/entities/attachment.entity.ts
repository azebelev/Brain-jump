import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Challenge } from './challenge.entity';

@Entity()
export class Attachment extends BasePkEntity {
  @Column()
  video: string;

  @Column()
  file: string;

  //Links
  @ManyToOne((type) => Challenge, (challenge) => challenge.attachment,{onDelete:'CASCADE'})
  challenge: Challenge;
}
