import { ConfigService } from '@nestjs/config';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ApiFetchAdapter implements HttpAdapter {
  constructor(
    private readonly configService: ConfigService
  ){}

  async get<T>(url: string, apiKey?: string): Promise<T> {
    const key = apiKey || this.getApiKeyForUrl(url);
    const headers: HeadersInit = {};
    if(key) headers['Authorization'] = `Bearer ${key}`;
    const res = await fetch(url, headers);
    if (!res.ok) throw new HttpException('Error al intentar conectar con la API externa', HttpStatus.INTERNAL_SERVER_ERROR)
    const data: T = await res.json();
    return data;
  }

  private getApiKeyForUrl (url: string) : string {
    if(url.includes('https://apiperu.dev/api/dni')) return this.configService.get<string>('API_KEY_RENIEC');
    return null;
  }
}