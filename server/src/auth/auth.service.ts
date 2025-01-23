import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { formatUserResponseForLogin } from './helpers/format-user-response-for-login';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly bcrypt: BcryptAdapter
  ){}

  async signIn (signInDto: SignInDto) {
    const { username, password } = signInDto;
    const user = await this.userService.findOne(username);
    if(!user) throw new NotFoundException(`Las credenciales no son válidas (nombre de usuario)`);
    const isPasswordValid = await this.bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new UnauthorizedException(`Las credenciales no son válidas (contraseña)`);
    return formatUserResponseForLogin(user);
  }

  async validateUser (username: string) {
    const user = await this.userService.findOne(username);
    if(!user) throw new UnauthorizedException(`Token no válido`);
    if(!user.isActive) throw new UnauthorizedException(`El usuario se encuentra inactivo, contactarse con el administrador`);
    if(!user.isConfirm) throw new UnauthorizedException(`El usuario no ha confirmado su cuenta`);
    return user;
  }
}
