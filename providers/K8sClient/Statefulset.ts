import { AppsV1Api, V1StatefulSet, KubeConfig } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'

export class Statefulset {
  protected AppsV1ApiClient: AppsV1Api
  constructor(kc: KubeConfig) {
    this.AppsV1ApiClient = kc.makeApiClient(AppsV1Api)
  }
  /**
   * Create a StatefulSet based on the yaml file passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   */
  public async createStateful(data: Object) {
    const state = new V1StatefulSet()
    extend(state, data)
    await this.AppsV1ApiClient.createNamespacedStatefulSet('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        return false
        throw new K8sErrorException('Error Creating Stateful ' + err.message)
      })
  }
  /**
   * Delete a StatefulSet based on resource name passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   */
  public async deleteStateful(resourceName: string) {
    return await this.AppsV1ApiClient.deleteNamespacedStatefulSet(resourceName, 'default')
      .then(() => {
        return true
      })
      .catch((err) => {
        return false
        throw new K8sErrorException('Error Deleting Stateful ' + err.message)
      })
  }
}
