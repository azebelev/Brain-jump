import { QueryRunner } from 'typeorm';
import { User } from '../entities/user.entity';

export async function seedUsers(queryRunner: QueryRunner) {
  await queryRunner.manager.getRepository(User).save([
    {
      name: 'Andrew',
      password: 'dsafads',
      email: 'andrejzeb@gmail.com',
    },
    {
      name: 'Andrew1',
      password: 'dsafads1',
      email: 'andrejzeb1@gmail.com',
    },
    {
      name: 'Andrew2',
      password: 'dsafads2',
      email: 'andrejzeb2@gmail.com',
    },
    {
      name: 'Andrew3',
      password: 'dsafads4',
      email: 'andrejzeb5@gmail.com',
    },
  ]);
}
