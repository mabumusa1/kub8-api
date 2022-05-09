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
   * @return  {Promise}                return the promise of the request
   */
  public isIngressExist(resourceName: string): Promise<boolean> {
    return this.NetworkingV1ApiClient.readNamespacedIngress(resourceName, 'default')
      .then(() => true)
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException(
            'Error Checking Ingress' + err.message,
            500,
            'E_RUNTIME_EXCEPTION'
          )
        }
      })
  }

  /**
   * Create a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */

  public createIngress(data: Object): Promise<boolean> {
    const state = new V1Ingress()
    extend(state, data)
    return this.NetworkingV1ApiClient.createNamespacedIngress('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(
          'Error Creating Ingress' + err.message,
          500,
          'E_RUNTIME_EXCEPTION'
        )
      })
  }

  /**
   * Deleet a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */

  public deleteIngress(resourceName: string): Promise<boolean> {
    return this.NetworkingV1ApiClient.deleteNamespacedIngress(resourceName, 'default')
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(
          'Error Creating Ingress' + err.message,
          500,
          'E_RUNTIME_EXCEPTION'
        )
      })
  }
}
