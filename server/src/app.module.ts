import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsModule } from './persons/persons.module';
import { StaffModule } from './staff/staff.module';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CertificateTypesModule } from './certificate-types/certificate-types.module';
import { DiseasesModule } from './diseases/diseases.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import config from './config/config';
import { RedisModule } from './redis/redis.module';
import { SeedModule } from './seed/seed.module';
import { ReportsModule } from './reports/reports.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    RedisModule,
    RolesModule,
    CommonModule,
    PersonsModule,
    StaffModule,
    PatientsModule,
    UsersModule,
    AuthModule,
    CertificateTypesModule,
    DiseasesModule,
    CertificatesModule,
    ExternalApisModule,
    SeedModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
