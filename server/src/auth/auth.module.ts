import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    ConfigModule,
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
  exports: [JwtStrategy],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
