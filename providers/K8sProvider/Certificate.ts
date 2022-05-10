import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
export class Certificate {
  protected CustomObjectsApiClient: CustomObjectsApi

  constructor(kc: KubeConfig) {
    this.CustomObjectsApiClient = kc.makeApiClient(CustomObjectsApi)
  }

  /**
   * Checks if the certificate exists
   *
   * @param   {string}  resourceName  then name of the resource to check
   *
   * @return  {Promise}                return the promise of the request
   */
  public isCertificateExist(resourceName: string): Promise<boolean> {
    return this.CustomObjectsApiClient.getNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName
    )
      .then(() => true)
      .catch((err) => {
        if (err.statusCode === 404) {
          return false
        } else {
          throw new K8sErrorException(
            'Error Checking Certificate ' + err.message,
            500,
            'E_K8S_EXCEPTION'
          )
        }
      })
  }

  /**
   * Create a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */
  public createCertificate(data: Object): Promise<boolean> {
    const state = new CustomObjectsApi()
    extend(state, data)
    return this.CustomObjectsApiClient.createNamespacedCustomObject(
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
        throw new K8sErrorException(
          'Error Creating Certificate ' + err.message,
          500,
          'E_K8S_EXCEPTION'
        )
      })
  }

  /**
   * Delete a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */
  public deleteCertificate(resourceName: string): Promise<boolean> {
    return this.CustomObjectsApiClient.deleteNamespacedCustomObject(
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
        throw new K8sErrorException(
          'Error Creating Certificate ' + err.message,
          500,
          'E_K8S_EXCEPTION'
        )
      })
  }
}
