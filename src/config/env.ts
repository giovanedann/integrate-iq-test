import dotenv from 'dotenv'

interface Env {
  port: string
  awsBearerToken: string
  awsApiUrl: string
}

dotenv.config()

const port = process.env.PORT as string
const awsBearerToken = process.env.AWS_BEARER_TOKEN as string
const awsApiUrl = process.env.AWS_API_URL as string

export const env: Env = {
  port,
  awsApiUrl,
  awsBearerToken
}
