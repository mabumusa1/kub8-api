import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
export default class K8Provider {
  constructor(protected app: ApplicationContract) {}

  public register() {}
}
