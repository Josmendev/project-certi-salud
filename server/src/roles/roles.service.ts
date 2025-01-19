import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { RoleResponse } from './interfaces/role-response.interface';
import { formatRoleResponse } from './helpers/format-role-response.helper';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ){}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponse> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async findAll(): Promise<RoleResponse[]> {
    const roles = await this.roleRepository.find({where: {isActive: true}});
    return roles.map(formatRoleResponse);
  }

  async findOne(id: number): Promise<RoleResponse | null> {
    const role = await this.roleRepository.findOneBy({roleId: id, isActive: true});
    if(!role) throw new NotFoundException(`Rol con el ID ${id} no fue encontrado`);
    return formatRoleResponse(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleResponse> {
    const role = await this.roleRepository.preload({
      roleId: id,
      ...updateRoleDto
    });
    if(!role || !role.isActive) throw new NotFoundException(`Rol con el ID ${id} no fue encontrado`);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    role.isActive = false;
    await this.roleRepository.save(role);
  }
}