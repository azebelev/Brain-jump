import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from 'src/persistence/entities/challenge.entity';
import { ChallengeClosure } from 'src/persistence/entities/challengeClosure.entity';
import { User } from 'src/persistence/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);
    const { password, ...result } = user;
    return result;
  }

  findAll() {
    return this.userRepo.find({ relations: { challenges: true } });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepo.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const challengeRepo = manager.getRepository(Challenge);
      const challengeClosureRepo = manager.getRepository(ChallengeClosure);

      const user = await userRepo.findOne({
        where: { id },
        relations: { challenges: true },
      });
      if (!user) return { affected: 0 };
      if (user.challenges.length) {
        const challengeIds = user.challenges.map((c) => c.id);
        await challengeClosureRepo
          .createQueryBuilder()
          .delete()
          .where('id_ancestor IN (:...ids) OR id_descendant IN (:...ids)', {
            ids: challengeIds,
          })
          .execute();
        await challengeRepo.delete(challengeIds);
      }

      return await userRepo.delete(id);
    });
  }
}
