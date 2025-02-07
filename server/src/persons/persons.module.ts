import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  exports: [PersonService],
  providers: [PersonService],
})
export class PersonsModule {}
