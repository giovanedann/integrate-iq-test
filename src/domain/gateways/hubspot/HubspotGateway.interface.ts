import { BatchResponseSimplePublicObject, BatchResponseSimplePublicObjectWithErrors } from "@hubspot/api-client/lib/codegen/crm/contacts"
import { AwsContact } from "../aws/AwsGateway.interface"

export interface HubspotContact {
  id: number
  firstname: string
  lastname: string
  email: string
  gender: string
  phonenumber: string
}

export interface IHubspotGateway {
  createBatchContacts: (contacts: AwsContact[]) => Promise<void>
}