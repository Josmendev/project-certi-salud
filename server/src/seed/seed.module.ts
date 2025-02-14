import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RolesModule } from 'src/roles/roles.module';
import { StaffModule } from 'src/staff/staff.module';
import { PatientsModule } from 'src/patients/patients.module';
import { UsersModule } from 'src/users/users.module';
import { PersonsModule } from 'src/persons/persons.module';

@Module({
  imports: [
    RolesModule,
    StaffModule,
    PatientsModule,
    UsersModule,
    PersonsModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
