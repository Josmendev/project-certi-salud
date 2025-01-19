import  * as bcrypt  from 'bcrypt';
import { EncryptionService } from '../interfaces/encryption-service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptAdapter implements EncryptionService {

  async hash(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
}