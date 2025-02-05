import { Injectable } from '@nestjs/common';
import { ReniecApiService } from '../external-apis/reniec-api/reniec-api.service';
import { PersonByDniResponse } from 'src/common/interfaces/person-by-dni-response.interface';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly reniecApiService: ReniecApiService
  ) {}

  async getPersonByDni(getPersonByDniDto: GetPersonByDniDto): Promise<PersonByDniResponse> {
    return await this.reniecApiService.getPersonByDni(getPersonByDniDto);
  }
}
