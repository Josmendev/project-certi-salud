import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { formatUserResponseForLogin } from './helpers/format-user-response-for-login';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { ValidateUserResponse } from './interfaces/validate-user-response.interface';
import { formatValidateUserResponse } from './helpers/format-validate-user-response.helper';
import { ConfirmAccountDto } from './dto/confirm-acount.dto';
import { ConfirmAccountResponse } from './interfaces/confirm-account.interface';
import { JwtAdapter } from 'src/common/adapters/jwt.adapter';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
    private readonly bcrypt: BcryptAdapter,
    // the service it is generated by the JWT module
    private readonly jwt: JwtAdapter,
  ) {}

  // Methods for endpoints
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { username, password } = loginDto;
    const user = await this.userService.findOneByUsername(username);
    if (!user)
      throw new NotFoundException(
        `Las credenciales no son válidas (nombre de usuario)`,
      );
    const isPasswordValid = await this.bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException(
        `Las credenciales no son válidas (contraseña)`,
      );
    const token = user.isConfirm ? this.getJwtToken({ id: user.userId }) : null;

    return {
      ...formatUserResponseForLogin(user),
      token,
    };
  }

  async confirmAccount(
    userId: number,
    confirmAccountDto: ConfirmAccountDto,
  ): Promise<ConfirmAccountResponse> {
    const { newPassword, repeatPassword } = confirmAccountDto;
    if (newPassword !== repeatPassword)
      throw new BadRequestException(`Las contraseñas no coinciden`);
    await this.userService.updatePasswordAndConfirm(userId, newPassword);
    return {
      token: this.getJwtToken({ id: userId }),
    };
  }

  async logout(req: any): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    const decodedToken = this.jwt.decode(token) as any;
    if (!decodedToken?.exp) throw new UnauthorizedException('Token no válido');
    const ttl = decodedToken.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) await this.blacklistToken(token, ttl);
  }

  // Internal helpers methods
  async validateUser(id: number): Promise<ValidateUserResponse> {
    const user = await this.userService.findOneById(id);
    if (!user) throw new UnauthorizedException(`Token no válido`);
    if (!user.isActive)
      throw new UnauthorizedException(
        `El usuario se encuentra inactivo, contactarse con el administrador`,
      );
    if (!user.isConfirm)
      throw new UnauthorizedException(`El usuario no ha confirmado su cuenta`);
    return formatValidateUserResponse(user);
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwt.sign(payload);
  }

  private async blacklistToken(token: string, ttl: number): Promise<void> {
    await this.redisService.set(`blacklist:${token}`, '1', ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return (await this.redisService.get(`blacklist:${token}`)) !== null;
  }
}
