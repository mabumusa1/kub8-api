import { CoreV1Api, KubeConfig, V1Service } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
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
  public async createService(data: Object) {
    const state = new V1Service()
    extend(state, data)
    return await this.CoreV1ApiClient.createNamespacedService('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        return false
        //throw new K8sErrorException('Error Creating Service ' + err.message)
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
        return false
        //throw new K8sErrorException('Error Deleting Service ' + err.message)
      })
  }
}
