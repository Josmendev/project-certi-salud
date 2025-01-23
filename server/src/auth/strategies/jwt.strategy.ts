import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // PassportStrategy: check if the JWT is based on the secret key and has not expired
  // Strategy: indicate if the token is valid
  constructor(
    private readonly AuthService: AuthService,
    configService: ConfigService
  ){
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      // where I expect to send that token -> Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }
  
  async validate(payload: JwtPayload): Promise<any> {
    // validate: validate the payload with the issued data once the token has been approved
    const { username } = payload;
    return await this.AuthService.validateUser(username);
  }
}