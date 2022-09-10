import {
  CoreV1Api,
  KubeConfig,
  V1Secret,
  NetworkingV1Api,
  V1Ingress,
} from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import bcrypt from 'bcryptjs'
import { types } from '@ioc:Adonis/Core/Helpers'
import GenericK8sException from 'App/Exceptions/GenericK8sException'

export class Lock {
  protected CoreV1ApiClient: CoreV1Api
  protected NetworkingV1ApiClient: NetworkingV1Api

  constructor(kc: KubeConfig) {
    this.CoreV1ApiClient = kc.makeApiClient(CoreV1Api)
    this.NetworkingV1ApiClient = kc.makeApiClient(NetworkingV1Api)
  }

  /**
   * Create a secert on the cluster with the client name
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async createSecret(data: Object) {
    const state = new V1Secret()
    extend(state, data)
    try {
      const result = await this.CoreV1ApiClient.createNamespacedSecret('default', state)
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }

  /**
   * Attach the secret to the ingress
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async attachSecret(resourceName: string, data: Object) {
    const state = new V1Ingress()
    extend(state, data)

    try {
      const headers = { 'content-type': 'application/strategic-merge-patch+json' }

      const result = await await this.NetworkingV1ApiClient.patchNamespacedIngress(
        resourceName,
        'default',
        data,
        undefined,
        undefined,
        undefined,
        undefined,
        { headers }
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
   * Attach the secret to the ingress
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */
  public async attachSecret(resourceName: string, data: Object) {
    const state = new V1Ingress()
    extend(state, data)

    try {
      const headers = { 'content-type': 'application/strategic-merge-patch+json' }

      const result = await await this.NetworkingV1ApiClient.patchNamespacedIngress(
        resourceName,
        'default',
        data,
        undefined,
        undefined,
        undefined,
        undefined,
        { headers }
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
   * Create htpasswd string
   *
   * @param   {string}  password  password to hash
   *
   * @return  {string}   htpasswd string
   */
  public createHash(password: string): string {
    let cost = 5
    let salt = bcrypt.genSaltSync(cost)
    let hash = bcrypt.hashSync(password, salt)
    return hash
  }

  /**
   * Create a secert on the cluster with the client name
   *
   * @param   {string}  resourceName name of the resource to delete
   *
   */
  public async removeSecret(resourceName: string) {
    try {
      const result = await this.CoreV1ApiClient.deletenamespacedsecrets(resourceName, 'default')
      return result
    } catch (err) {
      if (types.isObject(err.body)) {
        throw new K8sErrorException(JSON.stringify(err.body))
      }
      throw new GenericK8sException(err.message)
    }
  }
}
