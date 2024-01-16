import { Request, Response } from "express";

import { ICreateManyHubspotContactsUseCase } from './create-many-hubspot-contacts.interface'
import { IAwsGateway } from "../../../../domain/gateways/aws/AwsGateway.interface";
import { IHubspotGateway } from "../../../../domain/gateways/hubspot/HubspotGateway.interface";

export class CreateManyHubspotContactsUseCase implements ICreateManyHubspotContactsUseCase {
  constructor(
    private readonly awsGateway: IAwsGateway,
    private readonly hubspotGateway: IHubspotGateway
  ) {
    this.execute = this.execute.bind(this);
  }

  async execute(_req: Request, res: Response) {
    const awsContacts = await this.awsGateway.getContacts();

    try {
      await this.hubspotGateway.createBatchContacts(awsContacts);

      res.status(200).json({ status: 200, message: 'Contacts created successfully' })
    } catch (error: any) {
      // unfortunately, typescript does not provide typed try/catches yet, that's the only reason why "any" is being used as a type above 
      res.status(400).json({ status: 400, message: error.message })
    }
  }
}