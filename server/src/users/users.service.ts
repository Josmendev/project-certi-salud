import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, QueryRunner } from 'typeorm';
import { User } from './entities/user.entity';
import { UuidAdapter } from 'src/common/adapters/uuid.adapter';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly uuidAdapter: UuidAdapter
  ){}

  async create(createUserDto: CreateUserDto, queryRunner?: QueryRunner): Promise<User> {
    
    const { identityDocumentNumber, staff, role } = createUserDto;
    const repository = queryRunner? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = repository.create({
      username: identityDocumentNumber,
      password: identityDocumentNumber,
      staff,
      token: this.uuidAdapter.generate()
    });
    user.role = await this.rolesService.assignRolesToUser(role, queryRunner);
    return repository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
