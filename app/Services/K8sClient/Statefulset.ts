import { AppsV1Api, V1StatefulSet, KubeConfig } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
import { types } from '@ioc:Adonis/Core/Helpers'

export class Statefulset {
  protected AppsV1ApiClient: AppsV1Api
  constructor(kc: KubeConfig) {
    this.AppsV1ApiClient = kc.makeApiClient(AppsV1Api)
  }
  /**
   * Create a StatefulSet based on the yaml file passed
   *
   * @param   {Object}  data  yaml file content as an object
   * @param   {boolean}  dryRun  dry run
   *
   */
  public async createStateful(data: Object, dryRun: string = 'All') {
    const state = new V1StatefulSet()
    extend(state, data)
    try {
      const result = await this.AppsV1ApiClient.createNamespacedStatefulSet(
        'default',
        state,
        undefined,
        dryRun
      )
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }
  /**
   * Delete a StatefulSet based on resource name passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   */
  public async deleteStateful(resourceName: string, dryRun: string = 'All') {
    return await this.AppsV1ApiClient.deleteNamespacedStatefulSet(
      resourceName,
      'default',
      undefined,
      dryRun
    )
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
}
