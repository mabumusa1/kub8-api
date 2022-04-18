import {
  AppsV1Api,
  KubeConfig,
  V1StatefulSet,
  CoreV1Api,
  V1Service,
  CustomObjectsApi,
  NetworkingV1Api,
} from '@kubernetes/client-node'
import { types } from '@ioc:Adonis/Core/Helpers'
import { join } from 'path'
import { readFileSync } from 'fs-extra'
import { load } from 'js-yaml'
import { extend } from 'lodash'
import { K8sConfig } from 'Config/k8s'
import { Exception } from '@adonisjs/core/build/standalone'

export default class K8sWrapper {
  protected AppsV1Api: AppsV1Api
  protected CoreV1Api: CoreV1Api
  protected CustomObjectsApi: CustomObjectsApi
  protected NetworkingV1Api: NetworkingV1Api

  /**
   * Create an instance of the K8sWrapper
   *
   * @param   K8sConfig  config     K8sConfig
   *
   */
  constructor(config: typeof K8sConfig) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)

    this.AppsV1Api = kc.makeApiClient(AppsV1Api)
    this.CoreV1Api = kc.makeApiClient(CoreV1Api)
    this.CustomObjectsApi = kc.makeApiClient(CustomObjectsApi)
    this.NetworkingV1Api = kc.makeApiClient(NetworkingV1Api)
  }

  /**
   * Load the k8s yaml file
   *
   * @param   {String}  fileName  Yaml file that should be loaded
   * @param   {Object}  replace   Replce the content of the file, with the given object
   *
   * @return  {Object}            Yaml file content as an object
   */
  public loadYaml(fileName: string, replace?: { find: string; replace: string }): Object {
    const file = join(__dirname, '../..', 'yamls', `${fileName}.yml`)
    const template = readFileSync(file, 'utf8')
    var data
    if (types.isObject(replace)) {
      const re = new RegExp(replace!.find, 'g')
      data = load(template.replace(re, replace!.replace))
    } else {
      data = load(template)
    }
    return data
  }

  /**
   * return the original client object
   *
   * @return  {AppsV1Api}  return the original client object
   */
  public getClient() {
    return this.AppsV1Api
  }

  /**
   * Checks if the given resource exists
   *
   * @param   {string}  resourceName  The name of the resoruce to check for existence
   *
   * @return  {Promise}                return the promise of the request
   */
  public isStatefulSetExist(resourceName: string) {
    return this.AppsV1Api.readNamespacedStatefulSet(resourceName, 'default')
  }

  /**
   * Checks if the server exists
   *
   * @param   {string}  resourceName The name of ther resouce to check on Kub8
   *
   * @return  {Promise}                return the promise of the request
   */
  public isServiceExist(resourceName: string) {
    return this.CoreV1Api.readNamespacedService(resourceName, 'default')
    /*.then((res) => {
        throw new Error(resourceName + ' Service Exists.')
      })
      .catch((err) => {
        if (err['statusCode'] === 404) {
          console.log(resourceName + ' Service Not Exists.')
        } else {
          console.log(err)
        }
      })*/
  }

  /**
   * Check if the resource exists in Ingress
   *
   * @param   {string}  resourceName  then name of the resource to check
   *
   * @return  {Promise}                return the promise of the request
   */
  public isIngressExist(resourceName: string) {
    return this.NetworkingV1Api.readNamespacedIngress(resourceName, 'default')
    /*this.NetworkingV1Api.readNamespacedIngress(resourceName, 'default')
      .then((res) => {
        if (res['body'].metadata.name === resourceName) {
          console.log(resourceName + ' Ingress Exists.')
          return true
        }
      })
      .catch((err) => {
        if (err['statusCode'] === 404) {
          console.log(resourceName + ' Ingress Not Exists.')
          return false
        } else {
          console.log(err)
        }
      })*/
  }

  /**
   * Checks if the certificate exists
   *
   * @param   {string}  resourceName  then name of the resource to check
   *
   * @return  {Promise}                return the promise of the request
   */
  public isCertificateExist(resourceName: string) {
    return this.CustomObjectsApi.getNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName
    )
    /*
    this.CustomObjectsApi.getNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      resourceName
    )
      .then((res) => {
        if (res['body'].metadata.name === resourceName) {
          console.log(resourceName + ' Certificate Exists.')
          return true
        }
      })
      .catch((err) => {
        if (err['statusCode'] === 404) {
          console.log(resourceName + ' Certificate Not Exists.')
          return false
        } else {
          console.log(err)
        }
      })
    */
  }

  /**
   * Create a StatefulSet based on the yaml file passed
   *
   * @param   {Object}  data  yaml file content as an object
   *
   * @return  {Promise}        return the promise of the request
   */
  public createStateful(data: Object) {
    const state = new V1StatefulSet()
    extend(state, data)
    return this.AppsV1Api.createNamespacedStatefulSet('default', state)
  }

  /**
   * Create a Service based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */
  public createService(data: Object) {
    const state = new V1Service()
    extend(state, data)
    return this.CoreV1Api.createNamespacedService('default', state)
  }

  /**
   * Create a Certificate based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */
  public createCertificate(data: Object) {
    const state = new CustomObjectsApi()
    extend(state, data)
    return this.CustomObjectsApi.createNamespacedCustomObject(
      'cert-manager.io',
      'v1',
      'default',
      'certificates',
      state
    )
  }

  /**
   * Create a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   * @return  {Promise}       return the promise of the request
   */

  public createIngress(data: Object) {
    const state = new NetworkingV1Api()
    extend(state, data)
    return this.NetworkingV1Api.createNamespacedIngress('default', state)
  }

  /**
   * Check if the resource exists in the cluster
   * @param   {string}  resourceName  then name of the resource to check
   * @return   {Promise}                return the promise of the request
   */

  public async preFlightCheck(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const allPromises = Promise.all([
        this.isStatefulSetExist(resourceName)
          .then(() => true)
          .catch((err) => {
            if(err.statusCode === 404) {
              return false;
            }else{
              throw new Error(resourceName + ' StatefulSet Exists.')
            }
          }),
        this.isServiceExist(resourceName)
          .then(() => true)
          .catch(() => false),
        this.isIngressExist(resourceName)
          .then(() => true)
          .catch(() => false),
        this.isCertificateExist(resourceName)
          .then(() => true)
          .catch(() => false),
      ])
      await allPromises
        .then((values) => {
          resolve(values.every((element) => element === false))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
