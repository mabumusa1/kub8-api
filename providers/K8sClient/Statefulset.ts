import { AppsV1Api, V1StatefulSet, KubeConfig, HttpError } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import ConnectionException from 'App/Exceptions/ConnectionException'

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
  public async createStateful(data: Object, dryRun: string = 'false') {
    const state = new V1StatefulSet()
    extend(state, data)
    await this.AppsV1ApiClient.createNamespacedStatefulSet('default', state, 'false', dryRun)
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
   * Delete a StatefulSet based on resource name passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   */
  public async deleteStateful(resourceName: string, dryRun: string = 'false') {
    return await this.AppsV1ApiClient.deleteNamespacedStatefulSet(
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
