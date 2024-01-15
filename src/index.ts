import express from 'express'
import { env } from './config/env'
import { AwsGateway } from './gateways/aws'
import { HubspotGateway } from './gateways/hubspot';

const app = express()

const awsGateway = new AwsGateway();
const hubspotGateway = new HubspotGateway(awsGateway);

app.get('/', async (_req, res) => {
  const contacts = await hubspotGateway.createBatchContacts();

  return res.send(200).json(contacts)
})

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} 🚀`)
})