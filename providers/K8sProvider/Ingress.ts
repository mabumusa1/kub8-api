import { KubeConfig, NetworkingV1Api, V1Ingress } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
export class Ingress {
  protected NetworkingV1ApiClient: NetworkingV1Api

  constructor(kc: KubeConfig) {
    this.NetworkingV1ApiClient = kc.makeApiClient(NetworkingV1Api)
  }
  /**
   * Check if the resource exists in Ingress
   *
   * @param   {string}  resourceName  then name of the resource to check
   *
   */
  public async isIngressExist(resourceName: string) {
    return await this.NetworkingV1ApiClient.readNamespacedIngress(resourceName, 'default')
      .then(() => true)
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException('Error Checking Ingress ' + err.message)
        }
      })
  }

  /**
   * Create a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async createIngress(data: Object) {
    const state = new V1Ingress()
    extend(state, data)

    return await this.NetworkingV1ApiClient.createNamespacedIngress('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException('Error Creating Ingress ' + err.message)
      })
  }

  /**
   * Deleet a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async deleteIngress(resourceName: string) {
    return await this.NetworkingV1ApiClient.deleteNamespacedIngress(resourceName, 'default')
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException('Error Deleting Ingress ' + err.message)
      })
  }
}
