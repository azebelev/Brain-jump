import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Attachment } from 'src/persistence/entities/attachment.entity';
import { Challenge } from 'src/persistence/entities/challenge.entity';
import { ChallengeComment } from 'src/persistence/entities/challengeComment.entity';
import { ChallengeGroup } from 'src/persistence/entities/challengeGroup.entity';
import { User } from 'src/persistence/entities/user.entity';
import { DataSource } from 'typeorm';
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mssql',
  url: configService.get<string>('MS_SQL_APP_DB_CONNECTION_STRING'),
  options: {
    encrypt: false,
  },
  entities: [User, Challenge, ChallengeComment, ChallengeGroup, Attachment],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
