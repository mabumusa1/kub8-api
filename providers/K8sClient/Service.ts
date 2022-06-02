import { CoreV1Api, HttpError, KubeConfig, V1Service } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import ConnectionException from 'App/Exceptions/ConnectionException'
export class Service {
  protected CoreV1ApiClient: CoreV1Api

  constructor(kc: KubeConfig) {
    this.CoreV1ApiClient = kc.makeApiClient(CoreV1Api)
  }

  /**
   * Create a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async createService(data: Object, dryRun: string = 'false') {
    const state = new V1Service()
    extend(state, data)
    return await this.CoreV1ApiClient.createNamespacedService('default', state, 'false', dryRun)
      .then(() => {
        return true
      })
      .catch((err) => {
        if (err instanceof HttpError) {
          throw new K8sErrorException(err.body)
        } else {
          throw new ConnectionException(err)
        }
      })
  }

  /**
   * Delete a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   */
  public async deleteService(resourceName: string, dryRun: string = 'false') {
    return await this.CoreV1ApiClient.deleteNamespacedService(
      resourceName,
      'default',
      'false',
      dryRun
    )
      .then(() => {
        return true
      })
      .catch((err) => {
        if (err instanceof HttpError) {
          throw new K8sErrorException(err.body)
        } else {
          throw new ConnectionException(err)
        }
      })
  }
}
