import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { QueryRunner, Repository } from "typeorm";
import { CreatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>
  ){}

  async create(createPersonDto: CreatePersonDto, queryRunner?: QueryRunner): Promise<any> {
    const repository = queryRunner? queryRunner.manager.getRepository(Person) : this.personRepository;
    const person = repository.create(createPersonDto);
    return repository.save(person);
  }

  async isPersonRegistered(identityDocumentNumber: string) : Promise<Person> {
    const person = await this.personRepository.findOne({where: {identityDocumentNumber}, relations: ['staff']});
    return person;
  }
}