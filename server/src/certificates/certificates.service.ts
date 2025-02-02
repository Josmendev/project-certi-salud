import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiFetchAdapter } from '../common/adapters/api-fetch.adapter';
import { PersonReniec } from 'src/common/entities/person-reniec.entity';
import { PersonByDniResponse } from './interfaces/person-by-dni-response.interface';
import { formatPersonByDniResponse } from './helpers/format-person-by-dni-response.helper';
import { GetPersonByDniDto } from './dto/get-person-by-dni.dto';

@Injectable()
export class CertificatesService {
  constructor(private readonly apiFetchAdapter: ApiFetchAdapter) {}

  async getPersonByDni(getPersonByDniDto: GetPersonByDniDto): Promise<PersonByDniResponse> {
    const url = `https://apiperu.dev/api/dni`;
    const person: PersonReniec = await this.apiFetchAdapter.post(url, getPersonByDniDto);
    return formatPersonByDniResponse(person);
  }
}
