import { Module } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Disease]),
    AuthModule
  ],
  controllers: [DiseasesController],
  providers: [DiseasesService],
})
export class DiseasesModule {}
