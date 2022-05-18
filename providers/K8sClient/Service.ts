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
   */
  public async isServiceExist(resourceName: string) {
    return await this.CoreV1ApiClient.readNamespacedService(resourceName, 'default')
      .then(() => {
        throw new K8sErrorException('Service already exists')
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException(err)
        }
      })
  }

  /**
   * Create a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async createService(data: Object) {
    const state = new V1Service()
    extend(state, data)
    return await this.CoreV1ApiClient.createNamespacedService('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(err)
      })
  }

  /**
   * Delete a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   */
  public async deleteService(resourceName: string) {
    return await this.CoreV1ApiClient.deleteNamespacedService(resourceName, 'default')
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(err)
      })
  }
}
