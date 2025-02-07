export interface HttpAdapter {
  post<T>(url: string, body: any, apiKey?: string): Promise<T>;
}
