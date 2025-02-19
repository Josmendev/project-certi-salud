import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { CommonModule } from 'src/common/common.module';
import { ReniecApiModule } from 'src/external-apis/reniec-api/reniec-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { CertificateTypesModule } from 'src/certificate-types/certificate-types.module';
import { PatientsModule } from 'src/patients/patients.module';
import { AuthModule } from 'src/auth/auth.module';
import { StaffModule } from 'src/staff/staff.module';
import { DiseasesModule } from 'src/diseases/diseases.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    CommonModule,
    ReniecApiModule,
    CertificateTypesModule,
    PatientsModule,
    StaffModule,
    DiseasesModule,
    AuthModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
