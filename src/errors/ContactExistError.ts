export class ContactExistError extends Error {
  constructor() {
    super('You have tried to register a contact with an e-mail that already exists.')
    this.name = 'ContactExistError'
  }
}