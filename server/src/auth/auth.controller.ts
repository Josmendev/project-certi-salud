import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from './enums/role.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Get('private')
  @Auth(Role.administrador)
  testingPrivateRoute(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola mundo private'
    }
  }
}
