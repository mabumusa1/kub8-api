import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import { types } from '@ioc:Adonis/Core/Helpers'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
import Env from '@ioc:Adonis/Core/Env'
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
  public async createCertificate(data: Object, dryRun: string = 'All') {
    const state = new CustomObjectsApi()
    extend(state, data)

    try {
      const result = await this.CustomObjectsApiClient.createNamespacedCustomObject(
        'cert-manager.io',
        'v1',
        'default',
        'certificates',
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
   * Delete a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async deleteCertificate(resourceName: string, dryRun: string = 'All') {
    return await this.CustomObjectsApiClient.deleteNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName,
      undefined,
      undefined,
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

  /**
   * Create a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async patchCertificate(resourceName: string, domainName: string) {
    const currentCertificate = await this.CustomObjectsApiClient.getNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName
    )

    let newBody: any = currentCertificate.body
    newBody.spec.dnsNames = [domainName, `${resourceName}.${Env.get('DEPLOY_DOMAIN_NAME')}`]
    const state = new CustomObjectsApi()
    extend(state, newBody)
    try {
      const result = await this.CustomObjectsApiClient.replaceNamespacedCustomObject(
        'cert-manager.io',
        'v1',
        'default',
        'certificates',
        resourceName,
        state
      )
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }
}
