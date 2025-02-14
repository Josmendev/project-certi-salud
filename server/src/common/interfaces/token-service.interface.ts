export interface TokenService {
  sign(payload: object): string;
  decode(token: string): any;
}
