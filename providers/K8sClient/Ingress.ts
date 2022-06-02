import { HttpError, KubeConfig, NetworkingV1Api, V1Ingress } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import ConnectionException from 'App/Exceptions/ConnectionException'
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

  public async createIngress(data: Object, dryRun: string = 'false') {
    const state = new V1Ingress()
    extend(state, data)

    return await this.NetworkingV1ApiClient.createNamespacedIngress(
      'default',
      state,
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

  /**
   * Deleet a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async deleteIngress(resourceName: string, dryRun: string = 'false') {
    return await this.NetworkingV1ApiClient.deleteNamespacedIngress(
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
