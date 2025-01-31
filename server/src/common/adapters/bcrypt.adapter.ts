import  * as bcrypt  from 'bcrypt';
import { EncryptionService } from '../interfaces/encryption-service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptAdapter implements EncryptionService {
  constructor(){}

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, +process.env.HASH_ROUND);
  }

  hashSync(data: string): string {
    return bcrypt.hashSync(data, +process.env.HASH_ROUND);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
  
}