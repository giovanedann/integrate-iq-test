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
    
    try {
      await Promise.all(chunkedArray.map((contacts) => {
        const { contactsWithoutEmail } = this.filterUnregisteredContacts(contacts);

        const mappedUnregisteredContacts: BatchInputSimplePublicObjectInputForCreate = {
          inputs: contactsWithoutEmail.map((awsContact) => ({
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

        return this.client.crm.contacts.batchApi.create(mappedUnregisteredContacts);
      }))
    } catch (error) {
      // If this catches an error, means that the batch API throwed an error because some e-mail have already been registered
      for (const contacts of chunkedArray) {
        const { contactsWithEmail } = this.filterUnregisteredContacts(contacts)

        await Promise.all(contactsWithEmail.map((contact) => this.upsertContact(contact)))
      }
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
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