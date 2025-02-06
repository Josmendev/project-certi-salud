import { ConfigService } from '@nestjs/config';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class ApiFetchAdapter implements HttpAdapter {
  constructor() {}

  async post<T>(url: string, body: any, apiKey?: string): Promise<T> {
    const headers = this.getHeaders(url, apiKey);
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body)});
    return this.handleResponse<T>(res);
  }

  private getHeaders(url: string, apiKey?: string): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok || !data.success) throw new HttpException(
        { message: [data.message || 'Error en la API externa'], error: 'HttpException', statusCode: res.status }, res.status
      );
    return data;
  }
}
