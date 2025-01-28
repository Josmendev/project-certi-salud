import { Module } from '@nestjs/common';
import { CertificateTypesService } from './certificate-types.service';
import { CertificateTypesController } from './certificate-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateType } from './entities/certificate-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificateType])],
  controllers: [CertificateTypesController],
  providers: [CertificateTypesService],
})
export class CertificateTypesModule {}
