import {
  AppsV1Api,
  KubeConfig,
  V1StatefulSet,
  CoreV1Api,
  V1Service,
  CustomObjectsApi,
  NetworkingV1Api,
  V1Ingress,
} from '@kubernetes/client-node'
import { types } from '@ioc:Adonis/Core/Helpers'
import { join } from 'path'
import { readFileSync } from 'fs-extra'
import { load } from 'js-yaml'
import { extend } from 'lodash'
import { K8sConfig } from 'Config/k8s'
import { Exception } from '@adonisjs/core/build/standalone'
import Logger from '@ioc:Adonis/Core/Logger'

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
    const state = new V1Ingress()
    extend(state, data)
    return this.NetworkingV1Api.createNamespacedIngress('default', state)
  }

  /**
   * Check if the resource exists in the cluster
   * @param   {string}  resourceName  then name of the resource to check
   * @return   {Promise}                return the promise of the request
   */

  public async canCreateInstall(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const allPromises = Promise.all([
        this.isStatefulSetExist(resourceName)
          .then(() => true)
          .catch((err) => {
            if (err.statusCode === 404) {
              return false
            } else {
              throw new Exception('Check Statuful', err.message)
            }
          }),
        this.isServiceExist(resourceName)
          .then(() => true)
          .catch((err) => {
            if (err.statusCode === 404) {
              return false
            } else {
              throw new Exception('Check Service Exist', err.message)
            }
          }),
        this.isIngressExist(resourceName)
          .then(() => true)
          .catch((err) => {
            if (err.statusCode === 404) {
              return false
            } else {
              throw new Exception('Check Ingress', err.message)
            }
          }),
        this.isCertificateExist(resourceName)
          .then(() => true)
          .catch((err) => {
            if (err.statusCode === 404) {
              return false
            } else {
              throw new Exception('Check Certificate', err.message)
            }
          }),
      ])
      await allPromises
        .then((values) => {
          resolve(values.every((element) => element === false))
        })
        .catch((err) => {
          console.log(err)
          Logger.error(err.message)
          reject(err)
        })
    })
  }

  public async createInstall(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const statefulsetYml = this.loadYaml('01StatefulSet', {
        find: '{ CLIENT_NAME }',
        replace: resourceName,
      })

      const serviceYml = this.loadYaml('02Service', {
        find: '{ CLIENT_NAME }',
        replace: resourceName,
      })
      const certificateYml = this.loadYaml('03Certificate', {
        find: '{ CLIENT_NAME }',
        replace: resourceName,
      })
      const ingressYml = this.loadYaml('04Ingress', {
        find: '{ CLIENT_NAME }',
        replace: resourceName,
      })

      const allPromises = Promise.all([
        this.createStateful(statefulsetYml)
          .then(() => {
            return true
          })
          .catch((err) => {
            /**
             * Optional code to handle the rollback
             * if we agree on
             * this.deleteStateful(resourceName)
             */

            throw new Exception('Create Stateful ' + err.message)
          }),
        this.createService(serviceYml)
          .then(() => {
            return true
          })
          .catch((err) => {
            /**
             * Optional code to handle the rollback
             * if we agree on
             * this.deleteStateful(resourceName)
             */
            throw new Exception('Create Service ' + err.message)
          }),
        this.createIngress(ingressYml)
          .then(() => {
            return true
          })
          .catch((err) => {
            /**
             * Optional code to handle the rollback
             * if we agree on
             * this.deleteStateful(resourceName)
             */
            throw new Exception('Create Ingress ' + err.message)
          }),
        this.createCertificate(certificateYml)
          .then(() => {
            return true
          })
          .catch((err) => {
            /**
             * Optional code to handle the rollback
             * if we agree on
             * this.deleteStateful(resourceName)
             */
            throw new Exception('Create Certificate ' + err.message)
          }),
      ])
      await allPromises
        .then((values) => {
          resolve(values.every((element) => element === true))
        })
        .catch((err) => {
          Logger.error(err.message)
          reject(err)
        })
    })
  }

  public async rollBackInstall(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const allPromises = Promise.all([
        this.deleteStateful(resourceName),
        this.deleteService(serviceYml),
        this.deleteIngress(certificateYml),
        this.deleteCertificate(ingressYml),
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
