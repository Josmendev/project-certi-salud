import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { LoginDto } from './dto/login.dto';
import { ConfirmAccountDto } from './dto/confirm-acount.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('confirm-account/:id')
  confirmAcount(@Param('id') id: number, @Body() confirmAccountDto: ConfirmAccountDto) {
    return this.authService.confirmAccount(id, confirmAccountDto);
  }

  @Auth()
  @Get('user-profile')
  userProfile(@GetUser() user: User) {
    return user;
  }
}
