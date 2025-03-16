import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateCertificateCode1740846678093
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE PROCEDURE GenerateCertificateCode()
      BEGIN
        DECLARE lastNumber INT DEFAULT 0;
        DECLARE prefixCode VARCHAR(20);
        DECLARE lastCode VARCHAR(50);

        -- Generar el prefijo actual basado en el año y mes
        SET prefixCode = CONCAT('C-', YEAR(NOW()), LPAD(MONTH(NOW()), 2, '0'));

        -- Obtener el último código generado para el mes y año actuales
        SELECT 
            certificate_code
        INTO 
            lastCode
        FROM 
            certificate
        WHERE 
            certificate_code LIKE CONCAT(prefixCode, '%')
        ORDER BY 
            certificate_code DESC
        LIMIT 1;

        -- Extraer el número al final del código si existe
        IF lastCode IS NOT NULL THEN
            SET lastNumber = IFNULL(CAST(RIGHT(lastCode, 5) AS UNSIGNED), 0);
        END IF;

        -- Generar el nuevo código
        SELECT CONCAT(prefixCode, LPAD(lastNumber + 1, 5, '0')) AS certificate_code;
      END;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP PROCEDURE IF EXISTS GenerateCertificateCode;`,
    );
  }
}
