import { ConfigService } from '@nestjs/config';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ApiFetchAdapter implements HttpAdapter {
  private apiKey: string;
  constructor(
    private readonly configService: ConfigService
  ){
    this.apiKey = this.configService.get<string>('API_KEY_RENIEC');
  }

  async get<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      headers: {'Authorization' : `Bearer ${this.apiKey}`}
    });
    if (!res.ok) throw new HttpException('Error al intentar conectar con la API externa', HttpStatus.INTERNAL_SERVER_ERROR)
    const data: T = await res.json();
    return data;
  }
}