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
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('redis.host'),
            port: +configService.get<number>('redis.port'),
          },
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
