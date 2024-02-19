import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Attachment } from './attachment.entity';
import { ChallengeComment } from './challengeComment.entity';
import { ChallengeGroup } from './challengeGroup.entity';
import { User } from './user.entity';

@Entity()
export class Challenge extends BasePkEntity {
  @Column()
  title: string;

  @Column()
  tags: string;

  @Column({ nullable: false })
  description: string;

  //Links
  @ManyToOne(
    (type) => ChallengeGroup,
    (challengeGroup) => challengeGroup.challenges,
  )
  challengeGroup: ChallengeGroup;

  @ManyToOne((type) => User, (user) => user.challenges)
  author: User;

  @OneToMany(
    (type) => ChallengeComment,
    (challengeComment) => challengeComment.comment,
  )
  comments: ChallengeComment[];

  @OneToOne((type) => Attachment, (attachment) => attachment.challenge)
  attachment: Attachment;
}
