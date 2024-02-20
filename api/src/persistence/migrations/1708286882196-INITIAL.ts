import { MigrationInterface, QueryRunner } from "typeorm";
import { seedUsers } from '../seeds/seedUsers';

export class INITIAL1708286882196 implements MigrationInterface {
    name = 'INITIAL1708286882196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "challenge_comment" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_f98ed137cbfcef8de345f3d7045" DEFAULT getdate(), "modifiedAt" datetime2 CONSTRAINT "DF_23a9f58c4da31b175a51305551f" DEFAULT getdate(), "comment" nvarchar(255) NOT NULL, "challengeId" int, CONSTRAINT "PK_ed437b5ab8bc7a1df85ef3ec3bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenge_group" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4dfb91fe5b3b6cff847abf95280" DEFAULT getdate(), "modifiedAt" datetime2 CONSTRAINT "DF_22fbf03d2decfea0ea649ffed7f" DEFAULT getdate(), "title" nvarchar(255) NOT NULL, CONSTRAINT "PK_ba0939cd2e73434467c183b1f04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT getdate(), "modifiedAt" datetime2 CONSTRAINT "DF_1c8fa734b6a9627c4dca2bf0bc3" DEFAULT getdate(), "name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenge" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_0f6bcf4f766b27b1dcf2af7b478" DEFAULT getdate(), "modifiedAt" datetime2 CONSTRAINT "DF_16a9e5292a250762e0cd4a5776c" DEFAULT getdate(), "title" nvarchar(255) NOT NULL, "tags" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "challengeGroupId" int, "authorId" int, CONSTRAINT "PK_5f31455ad09ea6a836a06871b7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attachment" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_66cb9447753892e59ea4171f43e" DEFAULT getdate(), "modifiedAt" datetime2 CONSTRAINT "DF_e6fbd3b00ffbbd53b833ea8882e" DEFAULT getdate(), "video" nvarchar(255) NOT NULL, "file" nvarchar(255) NOT NULL, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "challenge_comment" ADD CONSTRAINT "FK_e47a4b401db89828dcc228c37fe" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge" ADD CONSTRAINT "FK_eb5e74fb53903f536541aa44fad" FOREIGN KEY ("challengeGroupId") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge" ADD CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        //await seedUsers(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74"`);
        await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_eb5e74fb53903f536541aa44fad"`);
        await queryRunner.query(`ALTER TABLE "challenge_comment" DROP CONSTRAINT "FK_e47a4b401db89828dcc228c37fe"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
        await queryRunner.query(`DROP TABLE "challenge"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "challenge_group"`);
        await queryRunner.query(`DROP TABLE "challenge_comment"`);
    }

}
