import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChallengeHierarchy1708689618899 implements MigrationInterface {
    name = 'AddChallengeHierarchy1708689618899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" DROP CONSTRAINT "FK_c0dd0b9486e44f0b6a547be3b2a"`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" DROP CONSTRAINT "FK_cf84c9dda30cefb92c7dea31a62"`);
        await queryRunner.query(`DROP INDEX "IDX_c0dd0b9486e44f0b6a547be3b2" ON "challenge_group_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_cf84c9dda30cefb92c7dea31a6" ON "challenge_group_closure"`);
        await queryRunner.query(`CREATE TABLE "challenge_closure" ("id_ancestor" int NOT NULL, "id_descendant" int NOT NULL, CONSTRAINT "PK_397eb49ca9e0b7ce717bca71449" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`ALTER TABLE "challenge" ADD "parentId" int`);
        await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74"`);
        await queryRunner.query(`ALTER TABLE "challenge" ALTER COLUMN "tags" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "challenge" ALTER COLUMN "authorId" int NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c0dd0b9486e44f0b6a547be3b2" ON "challenge_group_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf84c9dda30cefb92c7dea31a6" ON "challenge_group_closure" ("id_descendant") `);
        await queryRunner.query(`CREATE INDEX "IDX_a34c495a64b270e061575312c7" ON "challenge_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_e0dd18a57fe6e88b2a08d22668" ON "challenge_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "challenge" ADD CONSTRAINT "FK_d02077a77a7e258c9b9672e7f5a" FOREIGN KEY ("parentId") REFERENCES "challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge" ADD CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" ADD CONSTRAINT "FK_c0dd0b9486e44f0b6a547be3b2a" FOREIGN KEY ("id_ancestor") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" ADD CONSTRAINT "FK_cf84c9dda30cefb92c7dea31a62" FOREIGN KEY ("id_descendant") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_closure" ADD CONSTRAINT "FK_a34c495a64b270e061575312c78" FOREIGN KEY ("id_ancestor") REFERENCES "challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_closure" ADD CONSTRAINT "FK_e0dd18a57fe6e88b2a08d226680" FOREIGN KEY ("id_descendant") REFERENCES "challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge_closure" DROP CONSTRAINT "FK_e0dd18a57fe6e88b2a08d226680"`);
        await queryRunner.query(`ALTER TABLE "challenge_closure" DROP CONSTRAINT "FK_a34c495a64b270e061575312c78"`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" DROP CONSTRAINT "FK_cf84c9dda30cefb92c7dea31a62"`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" DROP CONSTRAINT "FK_c0dd0b9486e44f0b6a547be3b2a"`);
        await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74"`);
        await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_d02077a77a7e258c9b9672e7f5a"`);
        await queryRunner.query(`DROP INDEX "IDX_e0dd18a57fe6e88b2a08d22668" ON "challenge_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_a34c495a64b270e061575312c7" ON "challenge_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_cf84c9dda30cefb92c7dea31a6" ON "challenge_group_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_c0dd0b9486e44f0b6a547be3b2" ON "challenge_group_closure"`);
        await queryRunner.query(`ALTER TABLE "challenge" ALTER COLUMN "authorId" int`);
        await queryRunner.query(`ALTER TABLE "challenge" ALTER COLUMN "tags" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "challenge" ADD CONSTRAINT "FK_054c35ac0dc91e24bd1be24ee74" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge" DROP COLUMN "parentId"`);
        await queryRunner.query(`DROP TABLE "challenge_closure"`);
        await queryRunner.query(`CREATE INDEX "IDX_cf84c9dda30cefb92c7dea31a6" ON "challenge_group_closure" ("id_descendant") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0dd0b9486e44f0b6a547be3b2" ON "challenge_group_closure" ("id_ancestor") `);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" ADD CONSTRAINT "FK_cf84c9dda30cefb92c7dea31a62" FOREIGN KEY ("id_descendant") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_group_closure" ADD CONSTRAINT "FK_c0dd0b9486e44f0b6a547be3b2a" FOREIGN KEY ("id_ancestor") REFERENCES "challenge_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
