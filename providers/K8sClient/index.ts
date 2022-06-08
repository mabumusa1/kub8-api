import { KubeConfig } from '@kubernetes/client-node'
import { K8sConfig } from 'Config/k8s'
import { Statefulset } from './Statefulset'
import { Service } from './Service'
import { Ingress } from './Ingress'
import { Certificate } from './Certificate'
import { loadYamls } from './Helpers'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
export class K8sClient {
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
   */
  public async createInstall(resourceName: string): Promise<any> {
    const yamls = loadYamls({ CLIENT_NAME: resourceName })

    await this.statful.createStateful(yamls['01StatefulSet.yml'])
    await this.service.createService(yamls['02Service.yml'])
    await this.certificate.createCertificate(yamls['03Certificate.yml'])
    await this.ingress.createIngress(yamls['04Ingress.yml'])
  }

  /**
   * Remove a resource from the cluster
   * @param   {string}  resourceName  then name of the resource to check
   */
  public async deleteInstall(resourceName: string): Promise<any> {
    await this.statful.deleteStateful(resourceName)
    await this.service.deleteService(resourceName)
    await this.ingress.deleteIngress(resourceName)
    await this.certificate.deleteCertificate(resourceName)
  }

  /**
   * Maps a domain to resource
   * @param   {string}  resourceName  then name of the resource to check
   */
  public async setDomain(resourceName: string, domainName: string): Promise<any> {
    const yamls = loadYamls({ CLIENT_NAME: resourceName, DOMAIN_NAME: domainName })
    try {
      await this.ingress.createIngress(yamls['04Ingress.yml'])
      await this.certificate.createCertificate(yamls['03Certificate.yml'])
    } catch (error) {
      throw new K8sErrorException('setDomain: ' + error.message)
    }
  }
}
