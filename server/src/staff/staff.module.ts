import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    PersonsModule,
    UsersModule,
    CommonModule,
    AuthModule
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
