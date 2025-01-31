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
import { paginated } from '../common/interfaces/paginated.interface';
import { paginate } from 'src/common/helpers/paginate.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly bcrypt: BcryptAdapter
  ){}

  // Methods for endpoints
  async findAll(paginationDto: PaginationDto): Promise<paginated<UserResponse>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.staff', 'staff')
      .innerJoinAndSelect('user.role', 'role')
      .innerJoinAndSelect('staff.person', 'person')
      .where('user.isActive = true')
      .orderBy('user.createdAt', 'ASC');
    const users = await paginate(queryBuilder, paginationDto);
    return {
      ...users,
      data: users.data.map(formatUserResponse)
    }
  }

  async search(term: string): Promise<UserResponse[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const searchTerm = `%${term.toLowerCase()}%`;
    const user = await queryBuilder
      .innerJoinAndSelect('user.staff', 'staff')
      .innerJoinAndSelect('user.role', 'role')
      .innerJoinAndSelect('staff.person', 'person')
      .where(
        'user.isActive = true ' +
        'AND (LOWER(user.username) LIKE :searchTerm ' +
        'OR LOWER(person.name) LIKE :searchTerm ' +
        'OR LOWER(person.paternalSurname) LIKE :searchTerm ' +
        'OR LOWER(person.maternalSurname) LIKE :searchTerm '+
        'OR LOWER(role.description) LIKE :searchTerm)',
        { searchTerm }
      )
      .getMany();
    return user.map(formatUserResponse);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.findOneById(userId);
    const { role } = updateUserDto;
    if(!role || role.length === 0) return formatUserResponse(user);
    const newRolesInUser = await this.rolesService.findForUdateInUsers(role);
    user.role = newRolesInUser;
    const userUpdate = await this.userRepository.save(user);
    return formatUserResponse(userUpdate);
    
  }

  // Internal helper methods
  async create(createUserDto: CreateUserDto, queryRunner?: QueryRunner): Promise<User> {
    const { identityDocumentNumber, staff, role } = createUserDto;
    const repository = queryRunner? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = repository.create({
      username: identityDocumentNumber,
      password: identityDocumentNumber,
      staff
    });
    user.role = await this.rolesService.assignRolesToUser(role, queryRunner);
    return repository.save(user);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({where: {username, isActive: true}});
    return user;
  }

  async findOneById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({where: {userId}, relations: ['staff', 'staff.person']});
    return user;
  }

  async updatePasswordAndConfirm(userId: number, password: string) {
    const user = await this.userRepository.update(
      {userId},
      {password: this.bcrypt.hashSync(password), isConfirm: true}
    );
    if(user.affected === 0) throw new NotFoundException(`Usuario con el ID ${userId} no fue encontrado`);
  }

  async remove(staff: Staff, queryRunner?: QueryRunner): Promise<void> {
    const repository = queryRunner? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = await repository.update({staff}, {isActive: false});
    if(user.affected === 0) throw new NotFoundException(`El usuario no se encuentra registrado`);
  }

  async activate(staff: Staff, queryRunner?: QueryRunner): Promise<void> {
    const repository = queryRunner? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = await repository.update({staff}, {isActive: true});
    if(user.affected === 0) throw new NotFoundException(`El usuario no se encuentra registrado`);
  }
}
