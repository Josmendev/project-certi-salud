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

  async create(createPersonDto: CreatePersonDto, queryRunner: QueryRunner): Promise<any> {
    const person = queryRunner.manager.create(Person, createPersonDto);
    return queryRunner.manager.save(person);
  }

  async validatePersonAndStaff(identityDocumentNumber: string) : Promise<boolean> {
    const person = await this.personRepository.findOne({where: {identityDocumentNumber}, relations: ['staff']});
    console.log(person);
    if(!person) return true;
    const staff = person.staff;
    if(!staff) throw new BadRequestException(`Persona con DNI ${identityDocumentNumber} ya está registrada como paciente`);
    if (!staff.isActive) throw new BadRequestException(`El personal con DNI ${identityDocumentNumber} se encuentra desactivado`);
    throw new BadRequestException(`El personal con DNI ${identityDocumentNumber} ya se encuentra registrado`);
  }
}