export interface TokenService {
  sign(payload: object): string
}