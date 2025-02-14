import { Injectable } from '@nestjs/common';
import { ApiFetchAdapter } from 'src/common/adapters/api-fetch.adapter';
import { formatPersonByDniResponse } from './helpers/format-person-by-dni-response.helper';
import { PersonReniec } from './entities/person-reniec.entity';
import { PersonByDniResponse } from 'src/common/interfaces/person-by-dni-response.interface';
import { GetPersonByDniDto } from 'src/common/dto/get-person-by-dni.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReniecApiService {
  private readonly reniecApiUrl: string;
  private readonly reniecApiKey: string;
  constructor(
    private readonly apiFetchAdapter: ApiFetchAdapter,
    private configService: ConfigService,
  ) {
    this.reniecApiUrl = configService.get<string>('reniecApi.url');
    this.reniecApiKey = configService.get<string>('reniecApi.apiKey');
  }

  async getPersonByDni(
    getPersonByDniDto: GetPersonByDniDto,
  ): Promise<PersonByDniResponse> {
    const person: PersonReniec = await this.apiFetchAdapter.post(
      this.reniecApiUrl,
      getPersonByDniDto,
      this.reniecApiKey,
    );
    return formatPersonByDniResponse(person);
  }
}
