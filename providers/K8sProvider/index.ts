import { KubeConfig } from '@kubernetes/client-node'
import { K8sConfig } from 'Config/k8s'
import { Statefulset } from './Statefulset'
import { Service } from './Service'
import { Ingress } from './Ingress'
import { Certificate } from './Certificate'
import { loadYamls } from './Helpers'

export default class K8sProvider {
  private statful: Statefulset
  private service: Service
  private ingress: Ingress
  private certificate: Certificate

  /**
   * Create an instance of the K8sProvider
   *
   * @param   K8sConfig  config     K8sConfig
   *
   */
  constructor(config: typeof K8sConfig) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)
    this.statful = new Statefulset(kc)
    this.service = new Service(kc)
    this.ingress = new Ingress(kc)
    this.certificate = new Certificate(kc)
  }

  /**
   * Create a new install based on the pass parameters
   * @param   {string}  resourceName  then name of the resource to check
   * @return   {Promise}                return the promise of the request
   */
  public async createInstall(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const yamls = loadYamls({ CLIENT_NAME: resourceName })
      const allPromises = Promise.all([
        this.statful.createStateful(yamls['01StatefulSet.yml']),
        this.service.createService(yamls['02Service.yml']),
        this.ingress.createIngress(yamls['04Ingress.yml']),
        this.certificate.createCertificate(yamls['03Certificate.yml']),
      ])
      await allPromises
        .then((values) => {
          resolve(values.every((element) => element === true))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Check if the resource exists in the cluster
   * @param   {string}  resourceName  then name of the resource to check
   * @return   {Promise}                return the promise of the request
   */
  public async canCreateInstall(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const allPromises = Promise.all([
        this.statful.isStatefulSetExist(resourceName),
        this.service.isServiceExist(resourceName),
        this.ingress.isIngressExist(resourceName),
        this.certificate.isCertificateExist(resourceName),
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

  /**
   * Remove a resource from the cluster
   * @param   {string}  resourceName  then name of the resource to check
   * @return   {Promise}                return the promise of the request
   */
  public async rollBackInstall(resourceName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const allPromises = Promise.all([
        this.statful.deleteStateful(resourceName),
        this.service.deleteService(resourceName),
        this.ingress.deleteIngress(resourceName),
        this.certificate.deleteCertificate(resourceName),
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

  /**
   * Maps a domain to resource
   * @param   {string}  resourceName  then name of the resource to check
   * @return   {Promise}                return the promise of the request
   */
  public async setDomain(resourceName: string, domainName: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const yamls = loadYamls({ CLIENT_NAME: resourceName, DOMAIN_NAME: domainName })
      const allPromises = Promise.all([
        this.ingress.createIngress(yamls['04Ingress.yml']),
        this.certificate.createCertificate(yamls['03Certificate.yml']),
      ])
      await allPromises
        .then((values) => {
          resolve(values.every((element) => element === true))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
