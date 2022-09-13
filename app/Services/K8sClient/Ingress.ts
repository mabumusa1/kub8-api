import { KubeConfig, NetworkingV1Api, V1Ingress } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import { types } from '@ioc:Adonis/Core/Helpers'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
export class Ingress {
  protected NetworkingV1ApiClient: NetworkingV1Api

  constructor(kc: KubeConfig) {
    this.NetworkingV1ApiClient = kc.makeApiClient(NetworkingV1Api)
  }
  /**
   * Create a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async createIngress(data: Object, dryRun: boolean = false) {
    const state = new V1Ingress()
    extend(state, data)

    try {
      const result = await this.NetworkingV1ApiClient.createNamespacedIngress('default', state, undefined, dryRun)
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }

  /**
   * Deleet a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async deleteIngress(resourceName: string, dryRun: boolean = false) {
    return await this.NetworkingV1ApiClient.deleteNamespacedIngress(resourceName, 'default', undefined, dryRun)
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

  /**
   * Create a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async patchIngress(resourceName: string, data: Object, dryRun: boolean = false) {
    const state = new V1Ingress()
    extend(state, data)
    try {
      const headers = { 'content-type': 'application/strategic-merge-patch+json' }
      const result = await this.NetworkingV1ApiClient.patchNamespacedIngress(
        resourceName,
        'default',
        state,
        undefined,
        dryRun,
        undefined,
        undefined,
        { headers }
      )
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }
}
