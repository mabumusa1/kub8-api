import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import { types } from '@ioc:Adonis/Core/Helpers'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
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

    try {
      const result = await this.CustomObjectsApiClient.createNamespacedCustomObject(
        'cert-manager.io',
        'v1',
        'default',
        'certificates',
        state
      )
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(err.body.message)
      }
      throw new GenericK8sException(err.message)
    }
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
        if (types.isObject(err.body)) {
          throw new K8sErrorException(JSON.stringify(err.body))
        }
        throw new GenericK8sException(err.message)
      })
  }
}
