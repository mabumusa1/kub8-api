import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { K8sClient } from './K8sClient'

export default class K8Provider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('K8s/K8sClient', () => {
      const { K8sConfig } = this.app.config.get('k8s')
      return new K8sClient(K8sConfig)
    })
  }
}
