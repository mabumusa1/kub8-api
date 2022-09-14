import { CoreV1Api, KubeConfig, V1Service } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import { types } from '@ioc:Adonis/Core/Helpers'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
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
  public async createService(data: Object, dryRun?: string) {
    const state = new V1Service()
    extend(state, data)
    try {
      const result = await this.CoreV1ApiClient.createNamespacedService(
        'default',
        state,
        undefined,
        dryRun
      )
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }

  /**
   * Delete a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   */
  public async deleteService(resourceName: string, dryRun?: string) {
    return await this.CoreV1ApiClient.deleteNamespacedService(
      resourceName,
      'default',
      undefined,
      dryRun
    )
      .then(() => {
        return true
      })
      .catch((err) => {
        if (types.isObject(err.body)) {
          throw new K8sErrorException(JSON.stringify(err.body))
        }
        throw new GenericK8sException(err.message)
      })
  }
}
