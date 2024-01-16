import { Request, Response } from "express";

export interface ICreateManyHubspotContactsUseCase {
  execute: (req: Request, res: Response) => Promise<void>
}