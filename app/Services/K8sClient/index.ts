import { KubeConfig } from '@kubernetes/client-node'
import { Statefulset } from './Statefulset'
import { Service } from './Service'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import { Ingress } from './Ingress'
import { Certificate } from './Certificate'
import { Database } from './Database'
import { loadYamls } from './Helpers'
import getConfigForOptions from './Helpers/getConfigForOptions'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
import Env from '@ioc:Adonis/Core/Env'
import { EKSClient, DescribeClusterCommand, ClusterStatus } from '@aws-sdk/client-eks'
import { base64 } from '@ioc:Adonis/Core/Helpers'
import { Lock } from './Lock'

export default class K8sClient {
  private statful: Statefulset
  private service: Service
  private ingress: Ingress
  private certificate: Certificate
  private database: Database
  private lock: Lock
  private static instance: K8sClient
  public static state: ClusterStatus = 'PENDING'

  /**
   * Create an instance of the K8sProvider
   *
   * @param   K8sConfig  config     any
   *
   */
  private constructor(config: any) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)
    this.statful = new Statefulset(kc)
    this.service = new Service(kc)
    this.ingress = new Ingress(kc)
    this.certificate = new Certificate(kc)
    this.lock = new Lock(kc)
  }

  public static async initialize() {
    if (K8sClient.state === 'ACTIVE') return K8sClient.instance
    K8sClient.state = 'CREATING'
    try {
      const describeParams = { name: Env.get('K8S_CLUSTER_NAME') }
      const region = Env.get('AWS_REGION')
      const credentials = {
        accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
      }
      const clientEKS = new EKSClient({ region, credentials })

      const clusterInfo: any = await clientEKS.send(new DescribeClusterCommand(describeParams))
      const optionsConfig = await getConfigForOptions(clusterInfo.cluster, region)
      K8sClient.instance = new K8sClient(optionsConfig)
      K8sClient.state = 'ACTIVE'
      return K8sClient.instance
    } catch (error) {
      K8sClient.state = 'FAILED'
      throw new K8sErrorException(
        JSON.stringify({ message: 'could not initialize instance of K8sClient' })
      )
    }
  }

  /**
   * Create a new install based on the pass parameters
   * @param   {string}  resourceName  then name of the resource to check
   */
  public async createInstall(resourceName: string): Promise<any> {
    const yamls = loadYamls({
      CLIENT_NAME: resourceName,
      DOMAIN_NAME: Env.get('DEPLOY_DOMAIN_NAME'),
      ALB_DNS: Env.get('ALB_DNS'),
    })
    await this.statful.createStateful(yamls['01StatefulSet.yml'])
    await this.service.createService(yamls['02Service.yml'])
    await this.certificate.createCertificate(yamls['03Certificate.yml'])
    await this.ingress.createIngress(yamls['04Ingress.yml'])
    // TODO: Make it atomic function
    this.database = new Database(resourceName)

    try {
      await this.database.createDatabase()
    } catch (err) {
      console.log(err)
      throw new GenericK8sException('Database error: ' + err.message)
    }
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
    const yamls = loadYamls({
      CLIENT_NAME: resourceName,
      DOMAIN_NAME: Env.get('DEPLOY_DOMAIN_NAME'),
      CUSTOM_DOMAIN: domainName,
      ALB_DNS: Env.get('ALB_DNS'),
    })
    await this.certificate.patchCertificate(resourceName, domainName)
    await this.ingress.patchIngress(resourceName, yamls['05IngressSetDomain.yml'])
  }

  /**
   * Adds a lock to resource
   * @param   {string}  resourceName  then name of the resource to check
   */
  public async lockInstall(resourceName: string, password: string): Promise<any> {
    // Get the bcrypt hash of the password
    let hash = this.lock.createHash(password)
    // Append the user then base64 encode it
    let token = base64.encode(`sc_user:${hash}`)

    const yamls = loadYamls({
      CLIENT_NAME: resourceName,
      HASH: token,
    })
    await this.lock.createSecret(yamls['07Secret.yml'])
    await this.lock.attachSecret(resourceName, yamls['08PatchIngress.yml'])
  }

  /**
   * remove a lock to resource
   * @param   {string}  resourceName  then name of the resource to check
   */
  public async unLockInstall(resourceName: string): Promise<any> {
    const yamls = loadYamls({
      CLIENT_NAME: resourceName,
    })
    //Same code as the attach but the content of the yaml is different
    await this.lock.attachSecret(resourceName, yamls['11PatchIngressUnlock.yml'])
    await this.lock.removeSecret(resourceName)
  }
}
