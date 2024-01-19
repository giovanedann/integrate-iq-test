import { Request, Response } from "express";

import { IAwsGateway } from "../../../../domain/gateways/aws/AwsGateway.interface";
import { IHubspotGateway } from "../../../../domain/gateways/hubspot/HubspotGateway.interface";
import { ICreateManyHubspotContactsUseCase } from './create-many-hubspot-contacts.interface';

export class CreateManyHubspotContactsUseCase implements ICreateManyHubspotContactsUseCase {
  constructor(
    private readonly awsGateway: IAwsGateway,
    private readonly hubspotGateway: IHubspotGateway
  ) {
    this.execute = this.execute.bind(this);
  }

  async execute(_req: Request, res: Response) {
    const awsContacts = await this.awsGateway.getContacts();

      await this.hubspotGateway.createBatchContacts(awsContacts);

      res.status(200).json({ status: 200, message: 'Contacts created successfully' })
  }
}