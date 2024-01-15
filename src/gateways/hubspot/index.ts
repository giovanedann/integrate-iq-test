import { Client } from '@hubspot/api-client'

import { env } from '../../config/env'
import { IHubspotGateway } from '../../domain/gateways/hubspot/HubspotGateway.interface';
import { IAwsGateway } from '../../domain/gateways/aws/AwsGateway.interface';
import { BatchInputSimplePublicObjectInputForCreate } from '@hubspot/api-client/lib/codegen/crm/contacts';

export class HubspotGateway implements IHubspotGateway {
  constructor(private readonly awsGateway: IAwsGateway) { }

  private readonly accessToken = env.hubspotAccessToken
  private readonly client = new Client({ accessToken: this.accessToken })

  async createBatchContacts() {
    const contacts = await this.awsGateway.getContacts();

    const mappedContacts: BatchInputSimplePublicObjectInputForCreate = {
      inputs: [contacts[0]].map((awsContact) => ({
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

    const createdClients = await this.client.crm.contacts.batchApi.create(mappedContacts);

    return createdClients;
  }
}