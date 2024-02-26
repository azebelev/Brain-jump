import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Attachment } from './attachment.entity';
import { ChallengeComment } from './challengeComment.entity';
import { ChallengeGroup } from './challengeGroup.entity';
import { User } from './user.entity';

@Entity()
@Tree('closure-table')
export class Challenge extends BasePkEntity {
  @Column({ nullable: false })
  title: string;

  @Column({nullable:true})
  tags?: string;

  @Column()
  description?: string;

  @Column({ nullable: false })
  authorId: number;

  @Column({nullable:true})
  parentId:number;

  @Column({nullable:true})
  challengeGroupId?:number;

  //Links
  @TreeChildren()
  children:Challenge[];

  @TreeParent()
  parent:Challenge;

  @ManyToOne(
    (type) => ChallengeGroup,
    (challengeGroup) => challengeGroup.challenges,
    { nullable: false },
  )
  @JoinColumn({ name: 'challengeGroupId' })
  challengeGroup: ChallengeGroup;

  @ManyToOne((type) => User, (user) => user.challenges)
  @JoinColumn({ name: 'authorId'})
  author: User;

  @OneToMany(
    (type) => ChallengeComment,
    (challengeComment) => challengeComment.comment,
  )
  comments: ChallengeComment[];

  @OneToMany((type) => Attachment, (attachment) => attachment.challenge)
  attachment: Attachment[];
}
