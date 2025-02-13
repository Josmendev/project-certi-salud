import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // PassportStrategy: check if the JWT is based on the secret key and has not expired
  // Strategy: indicate if the token is valid
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwt.secret'),
      // where I expect to send that token -> Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<any> {
    // validate: validate the payload with the issued data once the token has been approved
    const token = req.get('Authorization').replace('Bearer ', '').trim();
    if (await this.authService.isBlacklisted(token))
      throw new UnauthorizedException('Token no válido o sesión expirada');
    const { id } = payload;
    return await this.authService.validateUser(id);
  }
}
