import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    PersonsModule,
    AuthModule,
    CommonModule,
  ],
  exports: [PatientsService],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
