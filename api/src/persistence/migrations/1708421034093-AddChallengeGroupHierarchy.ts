import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChallengeGroupHierarchy1708421034093 implements MigrationInterface {
    name = 'AddChallengeGroupHierarchy1708421034093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "challenge_group_closure" ("id_ancestor" int NOT NULL, "id_descendant" int NOT NULL, CONSTRAINT "PK_bcac3de65d7084c5531c91c5fa3" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0dd0b9486e44f0b6a547be3b2" ON "challenge_group_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf84c9dda30cefb92c7dea31a6" ON "challenge_group_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "challenge_group" ADD "description" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "challenge_group" ADD "parentId" int`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" int NOT NULL CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "challengeId" int`);
        await queryRunner.query(`ALTER TABLE "challenge_group" ADD CONSTRAINT "FK_f5fdb2e5484914c11c7bc7b686f" FOREIGN KEY ("parentId") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD CONSTRAINT "FK_665554bf2aa9417c36b43d5b819" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" ADD CONSTRAINT "FK_c0dd0b9486e44f0b6a547be3b2a" FOREIGN KEY ("id_ancestor") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" ADD CONSTRAINT "FK_cf84c9dda30cefb92c7dea31a62" FOREIGN KEY ("id_descendant") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" DROP CONSTRAINT "FK_cf84c9dda30cefb92c7dea31a62"`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" DROP CONSTRAINT "FK_c0dd0b9486e44f0b6a547be3b2a"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP CONSTRAINT "FK_665554bf2aa9417c36b43d5b819"`);
        await queryRunner.query(`ALTER TABLE "challenge_group" DROP CONSTRAINT "FK_f5fdb2e5484914c11c7bc7b686f"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "challengeId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_6620cd026ee2b231beac7cfe578"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "challenge_group" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "challenge_group" DROP COLUMN "description"`);
        await queryRunner.query(`DROP INDEX "IDX_cf84c9dda30cefb92c7dea31a6" ON "challenge_group_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_c0dd0b9486e44f0b6a547be3b2" ON "challenge_group_closure"`);
        await queryRunner.query(`DROP TABLE "challenge_group_closure"`);
    }

}
