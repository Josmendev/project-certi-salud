import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository, QueryRunner, In } from 'typeorm';
import { RoleResponse } from './interfaces/role-response.interface';
import { formatRoleResponse } from './helpers/format-role-response.helper';
import { paginate } from 'src/common/helpers/paginate.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginated } from 'src/common/interfaces/paginated.interface';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ){}

  // Methods for endopoints
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponse> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async findAll(paginationDto: PaginationDto): Promise<paginated<RoleResponse>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role')
      .where('isActive = true');
    const roles = await paginate(queryBuilder, paginationDto);
    return {
      ...roles,
      data: roles.data.map(formatRoleResponse)
    };
  }

  async search(term: string): Promise<RoleResponse[]> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    const searchTerm = `%${term.toLowerCase()}%`;
    const roles = await queryBuilder
      .where('isActive = true AND LOWER(description) LIKE :searchTerm', {searchTerm})
      .getMany();
    return roles.map(formatRoleResponse);
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto): Promise<RoleResponse> {
    const role = await this.roleRepository.preload({
      roleId,
      ...updateRoleDto
    });
    if(!role || !role.isActive) throw new NotFoundException(`Rol con el ID ${roleId} no fue encontrado`);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async active(roleId: number): Promise<void> {
    const role = await this.roleRepository.update({roleId},{isActive: true});
    if(role.affected === 0) throw new NotFoundException(`Rol con el ID ${roleId} no fue encontrado`);
  }

  async remove(roleId: number): Promise<void> {
    const role = await this.roleRepository.update({roleId},{isActive: false});
    if(role.affected === 0) throw new NotFoundException(`Rol con el ID ${roleId} no fue encontrado`);
  }

  // Internal helper methods
  
  async findForUdateInUsers(rolesId: number[]): Promise<Role[]> {
    const roles = await this.roleRepository.find({where: {roleId: In(rolesId)}});
    if(roles.length !== rolesId.length) {
      const missingIds = rolesId.filter(roleId => !roles.some(role => role.roleId === roleId));
      throw new NotFoundException(`Roles no encontrados: ${missingIds.join(', ')}`);
    }
    return roles;
  }

  async assignRolesToUser(role?: Role[], queryRunner?: QueryRunner): Promise<Role[]> {
    if(role && role.length > 0) return role;
    const repository = queryRunner? queryRunner.manager.getRepository(Role) : this.roleRepository;
    const registerRole = await repository.findOne({where: {roleId: 2}});
    if (!registerRole) throw new NotFoundException('El rol no se encuentra registrado');
    return [registerRole];
  }
}