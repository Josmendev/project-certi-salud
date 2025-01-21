import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { QueryRunner, Repository } from "typeorm";
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from "./dto/update-person.dto";
import { IsPersonRegisterDto } from "./dto/is-person-register.dto";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>
  ){}

  async create(createPersonDto: CreatePersonDto, queryRunner?: QueryRunner): Promise<Person> {
    const repository = queryRunner? queryRunner.manager.getRepository(Person) : this.personRepository;
    const person = repository.create(createPersonDto);
    return repository.save(person);
  }

  async update (personId: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.personRepository.preload({
      personId,
      ...updatePersonDto
    });
    if(!person) throw new NotFoundException(`La persona no se encuentra registrada`);
    return await this.personRepository.save(person);
  };

  async isPersonRegistered(isPersonRegisterdDto: IsPersonRegisterDto) : Promise<Person> {
    const {identityDocumentNumber, termRelation } = isPersonRegisterdDto;
    const person = await this.personRepository.findOne({where: {identityDocumentNumber}, relations: [termRelation]});
    return person;
  }
}