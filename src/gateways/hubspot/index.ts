import { Client } from '@hubspot/api-client';
import { BatchInputSimplePublicObjectInputForCreate } from '@hubspot/api-client/lib/codegen/crm/contacts';

import { env } from '../../config/env';
import { AwsContact } from '../../domain/gateways/aws/AwsGateway.interface';
import { IHubspotGateway } from '../../domain/gateways/hubspot/HubspotGateway.interface';
import { chunkArray } from '../../helpers/chunkArray';

export class HubspotGateway implements IHubspotGateway {
  private readonly accessToken = env.hubspotAccessToken
  private readonly client = new Client({ accessToken: this.accessToken })

  async createBatchContacts(contacts: AwsContact[]) {
    const chunkedArray = chunkArray(contacts, 100);
    
    // Using the batch api just to register contacts that does not have an e-mail
    await Promise.all(chunkedArray.map((contacts) => {
      const { contactsWithoutEmail } = this.filterUnregisteredContacts(contacts);

      const mappedContactsWithoutEmail: BatchInputSimplePublicObjectInputForCreate = {
        inputs: contactsWithoutEmail.map((awsContact) => ({
          properties: {
            firstname: awsContact.first_name,
            company: "Integrate IQ",
            website: "https://integrateiq.com/",
            lastname: awsContact.last_name,
            phone: awsContact.phone_number
          },
          associations: []
        }))
      }

      return this.client.crm.contacts.batchApi.create(mappedContactsWithoutEmail);
    }))
    
    // Using the legacy upsert createOrUpdate API to update contacts that already have an e-mail
    for (const contacts of chunkedArray) {
      const { contactsWithEmail } = this.filterUnregisteredContacts(contacts)
      await Promise.all(contactsWithEmail.map((contact) => this.upsertContact(contact)))
    }
  }

  async upsertContact(contact: AwsContact) {
    const body = {
      properties: [
        { property: 'firstname', value: contact.first_name },
        { property: 'lastname', value: contact.last_name },
        { property: 'website', value: 'https://integrateiq.com/' },
        { property: 'company', value: 'Integrate IQ' },
        { property: 'phone', value: contact.phone_number },
      ]
    }

    await fetch(`https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${contact.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.hubspotAccessToken}`
      },
      body: JSON.stringify(body)
    });
  }

  private filterUnregisteredContacts(contacts: AwsContact[]) {
    const contactsWithEmail = contacts.filter(({ email }) => Boolean(email)) // checking if e-mail exists on the object
    const contactsWithoutEmail = contacts.filter(({ email }) => !Boolean(email)) // checking if e-mail exists on the object

    return {
      contactsWithEmail,
      contactsWithoutEmail
    }
  }
}