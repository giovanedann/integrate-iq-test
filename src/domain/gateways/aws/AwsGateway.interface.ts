export interface AwsContact {
  id: number
  first_name: string
  last_name: string
  email: string
  gender: string
  phone_number: string
}

export interface IAwsGateway {
  getContacts: () => Promise<AwsContact[]>
}