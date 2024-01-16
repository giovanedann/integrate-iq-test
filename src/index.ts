import express from 'express'
import { env } from './config/env'
import { AwsGateway } from './gateways/aws'
import { HubspotGateway } from './gateways/hubspot';
import { CreateManyHubspotContactsUseCase } from './usecases/hubspot/contacts/create-many/create-many-hubspot-contacts.usecase';

const app = express()

const awsGateway = new AwsGateway();
const hubspotGateway = new HubspotGateway();

const createManyHubspotContactsUsecase = new CreateManyHubspotContactsUseCase(awsGateway, hubspotGateway)

app.get('/contacts/create-many', createManyHubspotContactsUsecase.execute)

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} 🚀`)
})