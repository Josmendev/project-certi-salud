import  * as bcrypt  from 'bcrypt';
import { EncryptionService } from '../interfaces/encryption-service.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptAdapter implements EncryptionService {
  private readonly hashSalt: number;
  constructor(
    private readonly configService: ConfigService
  ){
    this.hashSalt = configService.get<number>('hashSalt')
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, +this.hashSalt);
  }

  hashSync(data: string): string {
    return bcrypt.hashSync(data, +this.hashSalt);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
  
}