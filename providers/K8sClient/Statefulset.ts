import { AppsV1Api, V1StatefulSet, KubeConfig } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'

export class Statefulset {
  protected AppsV1ApiClient: AppsV1Api
  constructor(kc: KubeConfig) {
    this.AppsV1ApiClient = kc.makeApiClient(AppsV1Api)
  }
  /**
   * Checks if the given resource exists
   *
   * @param   {string}  resourceName  The name of the resoruce to check for existence
   *
   */
  public async isStatefulSetExist(resourceName: string) {
    return await this.AppsV1ApiClient.readNamespacedStatefulSet(resourceName, 'default')
      .then(() => {
        throw new K8sErrorException('Statefulset already exists')
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException('Error Checking Stateful ' + err.message)
        }
      })
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
    console.log(state)
    return await this.AppsV1ApiClient.createNamespacedStatefulSet('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        console.log(err)
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
        throw new K8sErrorException('Error Deleting Stateful ' + err.message)
      })
  }
}
