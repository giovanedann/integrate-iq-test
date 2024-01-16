import { Client } from '@hubspot/api-client'
import { BatchInputSimplePublicObjectInputForCreate } from '@hubspot/api-client/lib/codegen/crm/contacts';

import { env } from '../../config/env'
import { IHubspotGateway } from '../../domain/gateways/hubspot/HubspotGateway.interface';
import { AwsContact, IAwsGateway } from '../../domain/gateways/aws/AwsGateway.interface';
import { chunkArray } from '../../helpers/chunkArray';
import { ContactExistError } from '../../errors/ContactExistError';

export class HubspotGateway implements IHubspotGateway {
  constructor(private readonly awsGateway: IAwsGateway) { }

  private readonly accessToken = env.hubspotAccessToken
  private readonly client = new Client({ accessToken: this.accessToken })

  async createBatchContacts(contacts: AwsContact[]) {
    try {
      const chunkedArray = chunkArray(contacts, 100);

      await Promise.all(chunkedArray.map((contacts) => {
        const mappedContacts: BatchInputSimplePublicObjectInputForCreate = {
          inputs: contacts.map((awsContact) => ({
            properties: {
              email: awsContact.email,
              firstname: awsContact.first_name,
              company: "Integrate IQ",
              website: "https://integrateiq.com/",
              lastname: awsContact.last_name,
              phone: awsContact.phone_number
            },
            associations: []
          }))
        }

        return this.client.crm.contacts.batchApi.create(mappedContacts);
      }))
    } catch (error) {
      throw new ContactExistError();
    }
  }
}