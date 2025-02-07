import { Injectable } from '@nestjs/common';
import { IdGeneratorService } from '../interfaces/id-generator-service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UuidAdapter implements IdGeneratorService {
  generate(): string {
    return uuid();
  }
}
