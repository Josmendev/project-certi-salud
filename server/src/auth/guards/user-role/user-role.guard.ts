import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.get(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if(!user) throw new BadRequestException('No se encuentra registrado el usuario');
    const userRoleNames = user.role.map(role => role.description);
    const confirmationRole = requiredRoles.some(role => userRoleNames?.includes(role));
    if(confirmationRole) return true;

    throw new BadRequestException(`El usuario con el DNI ${user.username} no posee el rol de: [${requiredRoles}]`);
  }
}
