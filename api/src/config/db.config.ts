import { ConfigService } from '@nestjs/config';
import { Attachment } from 'src/persistence/entities/attachment.entity';
import { Challenge } from 'src/persistence/entities/challenge.entity';
import { ChallengeClosure } from 'src/persistence/entities/challengeClosure.entity';
import { ChallengeComment } from 'src/persistence/entities/challengeComment.entity';
import { ChallengeGroup } from 'src/persistence/entities/challengeGroup.entity';
import { ChallengeGroupClosure } from 'src/persistence/entities/challengeGroupClosure.entity';
import { User } from 'src/persistence/entities/user.entity';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

export const getDbConfig = async (
  configService: ConfigService,
): Promise<SqlServerConnectionOptions> => ({
  type: 'mssql',
  options: {
    encrypt: false,
  },
  url: configService.get('MS_SQL_APP_DB_CONNECTION_STRING'),
  entities: [
    User,
    Challenge,
    ChallengeClosure,
    ChallengeComment,
    ChallengeGroup,
    ChallengeGroupClosure,
    Attachment,
  ],
  logging: configService.get('NODE_ENV') === 'DEV',
  migrations: [`${__dirname}/../persistence/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  synchronize: false,
  migrationsRun: true,
});
