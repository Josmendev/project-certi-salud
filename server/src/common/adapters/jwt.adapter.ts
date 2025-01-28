import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../interfaces/token-service.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAdapter implements TokenService {
  constructor(
    private readonly jwtService: JwtService
  ){}
  sign(payload: object): string {
    return this.jwtService.sign(payload);
  }
}