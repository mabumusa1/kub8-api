import { KubeConfig, CustomObjectsApi, HttpError } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import ConnectionException from 'App/Exceptions/ConnectionException'
export class Certificate {
  protected CustomObjectsApiClient: CustomObjectsApi

  constructor(kc: KubeConfig) {
    this.CustomObjectsApiClient = kc.makeApiClient(CustomObjectsApi)
  }

  /**
   * Create a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async createCertificate(data: Object, dryRun: string = 'false') {
    const state = new CustomObjectsApi()
    extend(state, data)
    return await this.CustomObjectsApiClient.createNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      state,
      'false',
      dryRun
    )
      .then(() => {
        return true
      })
      .catch((err) => {
        console.log(err)
        if (err instanceof HttpError) {
          throw new K8sErrorException(err.body)
        } else {
          throw new ConnectionException(err)
        }
      })
  }

  /**
   * Delete a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async deleteCertificate(resourceName: string, dryRun: string = 'false') {
    return await this.CustomObjectsApiClient.deleteNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName,
      0,
      true,
      '',
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
