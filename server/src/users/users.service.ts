import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, QueryRunner } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { formatUserResponse } from './helpers/format-user-response.helper';
import { UserResponse } from './interfaces/user-response.interface';
import { Staff } from 'src/staff/entities/staff.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Paginated } from '../common/interfaces/paginated.interface';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly bcrypt: BcryptAdapter,
  ) {
    super(userRepository);
  }

  // Methods for endpoints
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<Paginated<UserResponse>> {
    return this.findAllBase(
      paginationDto,
      'user',
      formatUserResponse,
      (queryBuilder) => {
        queryBuilder
          .leftJoinAndSelect('user.staff', 'staff')
          .innerJoinAndSelect('user.role', 'role')
          .innerJoinAndSelect('staff.person', 'person')
          .where('user.isActive = true')
          .orderBy('user.createdAt', 'ASC');
      },
    );
  }

  async search(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<Paginated<UserResponse>> {
    return this.searchBase(
      term,
      paginationDto,
      'user',
      formatUserResponse,
      (queryBuilder, searchTerm) => {
        queryBuilder
          .leftJoinAndSelect('user.staff', 'staff')
          .innerJoinAndSelect('user.role', 'role')
          .innerJoinAndSelect('staff.person', 'person')
          .where(
            'user.isActive = true ' +
              'AND (user.username LIKE :searchTerm ' +
              'OR person.name LIKE :searchTerm ' +
              'OR person.paternalSurname LIKE :searchTerm ' +
              'OR person.maternalSurname LIKE :searchTerm ' +
              'OR role.description LIKE :searchTerm)',
            { searchTerm: `%${searchTerm}%` },
          )
          .orderBy('user.createdAt', 'ASC');
      },
    );
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.findOneById(userId);
    const { role } = updateUserDto;
    if (!role || role.length === 0) return formatUserResponse(user);
    const newRolesInUser = await this.rolesService.findForUdateInUsers(role);
    user.role = newRolesInUser;
    const userUpdate = await this.userRepository.save(user);
    return formatUserResponse(userUpdate);
  }

  // Internal helper methods
  async create(
    createUserDto: CreateUserDto,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    const { identityDocumentNumber, staff, role } = createUserDto;
    const repository = queryRunner
      ? queryRunner.manager.getRepository(User)
      : this.userRepository;
    const user = repository.create({
      username: identityDocumentNumber,
      password: this.bcrypt.hashSync(identityDocumentNumber),
      staff,
    });
    user.role = await this.rolesService.assignRolesToUser(role, queryRunner);
    return repository.save(user);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
    });
    return user;
  }

  async findOneById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['staff', 'staff.person'],
    });
    return user;
  }

  async updatePasswordAndConfirm(userId: number, password: string) {
    const user = await this.userRepository.update(
      { userId },
      { password: this.bcrypt.hashSync(password), isConfirm: true },
    );
    if (user.affected === 0)
      throw new NotFoundException(
        `Usuario con el ID ${userId} no fue encontrado`,
      );
  }

  async remove(staff: Staff, queryRunner?: QueryRunner): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(User)
      : this.userRepository;
    const user = await repository.update({ staff }, { isActive: false });
    if (user.affected === 0)
      throw new NotFoundException(`El usuario no se encuentra registrado`);
  }

  async activate(staff: Staff, queryRunner?: QueryRunner): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(User)
      : this.userRepository;
    const user = await repository.update({ staff }, { isActive: true });
    if (user.affected === 0)
      throw new NotFoundException(`El usuario no se encuentra registrado`);
  }
}
