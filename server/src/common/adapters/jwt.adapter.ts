import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../interfaces/token-service.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAdapter implements TokenService {
  constructor(
    private readonly jwtService: JwtService
  ){}
  decode(token: string) {
    return this.jwtService.decode(token);
  }
  sign(payload: object): string {
    return this.jwtService.sign(payload);
  }
}