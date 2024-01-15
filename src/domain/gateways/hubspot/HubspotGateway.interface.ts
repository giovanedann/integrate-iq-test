import { BatchResponseSimplePublicObject, BatchResponseSimplePublicObjectWithErrors } from "@hubspot/api-client/lib/codegen/crm/contacts"

export interface HubspotContact {
  id: number
  firstname: string
  lastname: string
  email: string
  gender: string
  phonenumber: string
}

export interface IHubspotGateway {
  createBatchContacts: () => Promise<BatchResponseSimplePublicObject | BatchResponseSimplePublicObjectWithErrors>
}