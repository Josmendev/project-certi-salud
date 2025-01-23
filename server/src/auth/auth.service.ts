import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly bcrypt: BcryptAdapter
  ){}

  async signIn (signInDto: SignInDto) {
    const { username, password } = signInDto;
    const user = await this.userService.findOne(username);
    const isPasswordValid = await this.bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new UnauthorizedException(`Las credenciales no son válidas (contraseña)`);
    return user;
  }
}
