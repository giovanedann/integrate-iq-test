import express from 'express'
import { env } from './config/env'
import { AwsGateway } from './gateways/aws'

const app = express()

const awsGateway = new AwsGateway();

app.get('/', async (_req, res) => {
  const contacts = await awsGateway.getContacts();

  return res.status(200).json(contacts)
})

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} 🚀`)
})