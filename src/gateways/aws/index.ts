import { env } from '../../config/env'
import { AwsContact, IAwsGateway } from '../../domain/gateways/aws/AwsGateway.interface'

export class AwsGateway implements IAwsGateway {
  private readonly apiUrl = env.awsApiUrl
  private readonly apiBearerToken = env.awsBearerToken

  async getContacts() {
    const contacts = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiBearerToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json()) as AwsContact[]

    return contacts;
  }
}