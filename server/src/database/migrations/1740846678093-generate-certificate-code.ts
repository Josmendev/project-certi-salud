import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateCertificateCode1740846678093
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE PROCEDURE GenerateCertificateCode()
      BEGIN
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN 
              CONCAT('C-', YEAR(NOW()), MONTH(NOW()), LPAD(SUBSTR(MAX(certificate_code), 9, 6) + 1, 5, '0'))
            ELSE 
              CONCAT('C-', YEAR(NOW()), MONTH(NOW()), '00001')
          END AS certificate_code
        FROM 
          certificate
        WHERE 
          YEAR(issue_date) = YEAR(NOW()) 
          AND MONTH(issue_date) = MONTH(NOW());
      END;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP PROCEDURE IF EXISTS GenerateCertificateCode;`,
    );
  }
}
