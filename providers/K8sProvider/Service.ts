import { CoreV1Api, KubeConfig, V1Service } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
export class Service {
  protected CoreV1ApiClient: CoreV1Api

  constructor(kc: KubeConfig) {
    this.CoreV1ApiClient = kc.makeApiClient(CoreV1Api)
  }

  /**
   * Checks if the server exists
   *
   * @param   {string}  resourceName The name of ther resouce to check on Kub8
   *
   * @return  {Promise}                return the promise of the request
   */
  public isServiceExist(resourceName: string): Promise<boolean> {
    return this.CoreV1ApiClient.readNamespacedService(resourceName, 'default')
      .then(() => true)
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException(
            'Error Checking Service' + err.message,
            500,
            'E_RUNTIME_EXCEPTION'
          )
        }
      })
  }

  /**
   * Create a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */
  public createService(data: Object): Promise<boolean> {
    const state = new V1Service()
    extend(state, data)
    return this.CoreV1ApiClient.createNamespacedService('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(
          'Error Creating Service' + err.message,
          500,
          'E_RUNTIME_EXCEPTION'
        )
      })
  }

  /**
   * Delete a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */
  public deleteService(resourceName: string): Promise<boolean> {
    return this.CoreV1ApiClient.deleteNamespacedService(resourceName, 'default')
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(
          'Error Creating Service' + err.message,
          500,
          'E_RUNTIME_EXCEPTION'
        )
      })
  }
}
