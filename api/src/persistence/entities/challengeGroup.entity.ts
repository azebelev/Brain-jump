import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Challenge } from './challenge.entity';

@Entity()
@Tree('closure-table')
export class ChallengeGroup extends BasePkEntity {
  
  @Column({ nullable: false })
  title: string;

  @Column({nullable:true})
  description:string;

  @Column({nullable:true})
  parentId:number;

  //Links
  @TreeChildren()
  children:ChallengeGroup[];

  @TreeParent()
  parent:ChallengeGroup;

  @OneToMany((type) => Challenge, (challenge) => challenge.challengeGroup)
  challenges: Challenge[];
}
