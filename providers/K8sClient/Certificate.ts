import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
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
  public async createCertificate(data: Object) {
    const state = new CustomObjectsApi()
    extend(state, data)
    return await this.CustomObjectsApiClient.createNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      state
    )
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException('Error Creating Certificate ' + err.message)
      })
  }

  /**
   * Delete a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async deleteCertificate(resourceName: string) {
    return await this.CustomObjectsApiClient.deleteNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName
    )
      .then(() => {
        return true
      })
      .catch((err) => {
        throw new K8sErrorException('Error Deleting Certificate ' + err.message)
      })
  }
}
