import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed.data';
import { RolesService } from 'src/roles/roles.service';
import { StaffService } from 'src/staff/staff.service';
import { PatientsService } from 'src/patients/patients.service';
import { StaffResponse } from 'src/staff/interfaces/staff-response.interface';
import { UsersService } from 'src/users/users.service';
import { PersonService } from 'src/persons/person.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly staffService: StaffService,
    private readonly patientsService: PatientsService,
    private readonly usersService: UsersService,
    private readonly personService: PersonService,
  ) {}
  async runSeed(): Promise<string> {
    await this.deleteAllTables();
    await this.insertRoles();
    const staff = await this.insertStaff();
    await this.assignRoleAdmin(staff.person.identityDocumentNumber);
    await this.insertPatients();
    return 'Seed ejecutado con éxito';
  }

  private async insertRoles(): Promise<boolean> {
    const insertPromises = [];
    initialData.roles.forEach((role) => {
      insertPromises.push(this.rolesService.create(role));
    });
    await Promise.all(insertPromises);
    return true;
  }

  private async insertStaff(): Promise<StaffResponse> {
    const insertPromises = [];
    initialData.staff.forEach((staff) => {
      insertPromises.push(this.staffService.create(staff));
    });
    const staff = await Promise.all(insertPromises);
    return staff[0];
  }

  private async assignRoleAdmin(
    identityDocumentNumber: string,
  ): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(
      identityDocumentNumber,
    );
    await this.usersService.update(user.userId, { role: [1] });
    return true;
  }

  private async insertPatients(): Promise<boolean> {
    const insertPromises = [];
    initialData.patients.forEach((patient) => {
      insertPromises.push(this.patientsService.create(patient));
    });
    await Promise.all(insertPromises);
    return true;
  }

  private async deleteAllTables(): Promise<void> {
    await this.usersService.deleteAll();
    await this.rolesService.deleteAll();
    await this.staffService.deleteAll();
    await this.patientsService.deleteAll();
    await this.personService.deleteAll();
  }
}
