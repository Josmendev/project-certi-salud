import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    // register: register strategy with authentication
    PassportModule.register({defaultStrategy: 'jwt'}),
    // register: register async module
    JwtModule.registerAsync({
      // imports: modules
      imports: [ConfigModule],
      // injects: services
      inject: [ConfigService],
      // useFactory: when attempting to asynchronously call the module
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h'
        }
      })
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
