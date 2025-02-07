import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository, QueryRunner, In } from 'typeorm';
import { RoleResponse } from './interfaces/role-response.interface';
import { formatRoleResponse } from './helpers/format-role-response.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Paginated } from 'src/common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  // Methods for endopoints
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponse> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<Paginated<RoleResponse>> {
    return this.findAllBase(
      paginationDto,
      'role',
      formatRoleResponse,
      (queryBuilder) => {
        queryBuilder.orderBy('role.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<RoleResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      'role',
      formatRoleResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .where('description LIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          })
          .orderBy('role.createdAt', 'ASC');
      },
    );
  }

  async update(
    roleId: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponse> {
    const role = await this.roleRepository.preload({
      roleId,
      ...updateRoleDto,
    });
    if (!role || !role.isActive)
      throw new NotFoundException(`Rol con el ID ${roleId} no fue encontrado`);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async active(roleId: number): Promise<void> {
    const role = await this.roleRepository.update(
      { roleId },
      { isActive: true },
    );
    if (role.affected === 0)
      throw new NotFoundException(`Rol con el ID ${roleId} no fue encontrado`);
  }

  async remove(roleId: number): Promise<void> {
    const role = await this.roleRepository.update(
      { roleId },
      { isActive: false },
    );
    if (role.affected === 0)
      throw new NotFoundException(`Rol con el ID ${roleId} no fue encontrado`);
  }

  // Internal helper methods

  async findForUdateInUsers(rolesId: number[]): Promise<Role[]> {
    const roles = await this.roleRepository.find({
      where: { roleId: In(rolesId) },
    });
    if (roles.length !== rolesId.length) {
      const missingIds = rolesId.filter(
        (roleId) => !roles.some((role) => role.roleId === roleId),
      );
      throw new NotFoundException(
        `Roles no encontrados: ${missingIds.join(', ')}`,
      );
    }
    return roles;
  }

  async assignRolesToUser(
    role?: Role[],
    queryRunner?: QueryRunner,
  ): Promise<Role[]> {
    if (role && role.length > 0) return role;
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Role)
      : this.roleRepository;
    const registerRole = await repository.findOne({ where: { roleId: 2 } });
    if (!registerRole)
      throw new NotFoundException('El rol no se encuentra registrado');
    return [registerRole];
  }
}
