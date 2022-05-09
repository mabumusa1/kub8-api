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
   * @return  {Promise}                return the promise of the request
   */
  public isStatefulSetExist(resourceName: string): Promise<boolean> {
    return this.AppsV1ApiClient.readNamespacedStatefulSet(resourceName, 'default')
      .then(() => true)
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException(
            'Error Creating Stateful' + err.message,
            500,
            'E_RUNTIME_EXCEPTION'
          )
        }
      })
  }
  /**
   * Create a StatefulSet based on the yaml file passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   * @return  {Promise}        return the promise of the request
   */
  public createStateful(data: Object): Promise<boolean> {
    const state = new V1StatefulSet()
    extend(state, data)
    return this.AppsV1ApiClient.createNamespacedStatefulSet('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(
          'Error Creating Stateful' + err.message,
          500,
          'E_RUNTIME_EXCEPTION'
        )
      })
  }
  /**
   * Delete a StatefulSet based on resource name passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   * @return  {Promise}        return the promise of the request
   */
  public deleteStateful(resourceName: string): Promise<boolean> {
    return this.AppsV1ApiClient.deleteNamespacedStatefulSet(resourceName, 'default')
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException(
          'Error deleting Stateful' + err.message,
          500,
          'E_RUNTIME_EXCEPTION'
        )
      })
  }
}
