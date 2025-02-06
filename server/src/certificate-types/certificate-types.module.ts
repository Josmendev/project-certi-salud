import { Module } from '@nestjs/common';
import { CertificateTypesService } from './certificate-types.service';
import { CertificateTypesController } from './certificate-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateType } from './entities/certificate-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificateType]),
    AuthModule
  ],
  controllers: [CertificateTypesController],
  providers: [CertificateTypesService],
})
export class CertificateTypesModule {}
