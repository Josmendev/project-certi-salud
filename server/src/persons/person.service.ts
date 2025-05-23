import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { IsPersonRegisterDto } from './dto/is-person-register.dto';
import { BaseService } from 'src/common/services/base.service';
import { TermRelationWithPerson } from './enum/term-relation.enum';

@Injectable()
export class PersonService extends BaseService<Person> {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {
    super(personRepository);
  }

  // Internal helpers methods
  async create(
    createPersonDto: CreatePersonDto,
    queryRunner?: QueryRunner,
  ): Promise<Person> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Person)
      : this.personRepository;
    const person = repository.create(createPersonDto);
    return repository.save(person);
  }

  async update(
    personId: number,
    updatePersonDto: UpdatePersonDto,
    queryRunner?: QueryRunner,
  ): Promise<Person> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Person)
      : this.personRepository;
    const person = await repository.preload({
      personId,
      ...updatePersonDto,
    });
    if (!person)
      throw new NotFoundException(`La persona no se encuentra registrada`);
    return await repository.save(person);
  }

  async isPersonRegistered(
    isPersonRegisterdDto: IsPersonRegisterDto,
  ): Promise<Person> {
    const { identityDocumentNumber, termRelation } = isPersonRegisterdDto;
    const relations = termRelation
      ? [termRelation]
      : [TermRelationWithPerson.staff, TermRelationWithPerson.patient];
    const person = await this.personRepository.findOne({
      where: { identityDocumentNumber },
      relations: relations,
    });
    return person;
  }
}
