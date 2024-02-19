import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BasePkEntity } from './abstract/basePk.entity';
import { Challenge } from './challenge.entity';

@Entity()
export class User extends BasePkEntity {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  //Links
  @OneToMany((type) => Challenge, (challenge) => challenge.author)
  @JoinColumn()
  challenges: Challenge[];
}
