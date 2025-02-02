import { ConfigService } from '@nestjs/config';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class ApiFetchAdapter implements HttpAdapter {
  constructor(private readonly configService: ConfigService) {}

  async post<T>(url: string, body: any, apiKey?: string): Promise<T> {
    const headers = this.getHeaders(url, apiKey);
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body)});
    return this.handleResponse<T>(res);
  }

  private getHeaders(url: string, apiKey?: string): HeadersInit {
    const key = apiKey || this.getApiKeyForUrl(url);
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok || !data.success) throw new HttpException(
        { message: [data.message || 'Error en la API externa'], error: 'HttpException', statusCode: res.status }, res.status
      );
    return data;
  }

  private getApiKeyForUrl(url: string): string {
    if (url.includes('https://apiperu.dev/api/dni')) return this.configService.get<string>('API_KEY_RENIEC');
    return null;
  }
}
