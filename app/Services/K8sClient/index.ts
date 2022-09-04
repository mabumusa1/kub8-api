import { KubeConfig } from '@kubernetes/client-node'
import { K8sConfig } from 'Config/k8s'
import { Statefulset } from './Statefulset'
import { Service } from './Service'
import { Ingress } from './Ingress'
import { Certificate } from './Certificate'
import { Database } from './Database'
import { loadYamls } from './Helpers'
import getConfigForOptions from './Helpers/getConfigForOptions'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
import Env from '@ioc:Adonis/Core/Env'
import {
  EKSClient,
  DescribeClusterCommand,
  CreateClusterCommand,
  ClusterStatus,
} from '@aws-sdk/client-eks'

export default class K8sClient {
  private statful: Statefulset
  private service: Service
  private ingress: Ingress
  private certificate: Certificate
  private database: Database
  private static instance: K8sClient
  private static state: ClusterStatus = 'PENDING'

  /**
   * Create an instance of the K8sProvider
   *
   * @param   K8sConfig  config     K8sConfig
   *
   */
  private constructor(config: typeof K8sConfig) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)
    this.statful = new Statefulset(kc)
    this.service = new Service(kc)
    this.ingress = new Ingress(kc)
    this.certificate = new Certificate(kc)
  }

  public static async initialize() {
    if (K8sClient.instance) return K8sClient.instance
    K8sClient.state = 'CREATING'
    try {
      const describeParams = { name: Env.get('K8S_CLUSTER_NAME') }
      const region = Env.get('AWS_REGION')
      const credentials = {
        accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
      }
      // boilerplate for the aws config request
      // const awsConfigData = axios.get<EnterResponseDataTypeHere>(url, OptionalOptionsObjectIfNeeded?)
      const clientEKS = new EKSClient({ region, credentials })
      const clusterInfo = await clientEKS.send(new DescribeClusterCommand(describeParams))
      if (clusterInfo.cluster) {
        const optionsConfig = await getConfigForOptions(clusterInfo.cluster, region)
        K8sClient.instance = new K8sClient(optionsConfig)
        K8sClient.state = 'ACTIVE'

        return K8sClient.instance
      } else {
        throw new Error('Failed to get cluster info!')
      }
    } catch (error) {
      K8sClient.state = 'FAILED'
      console.error("couldn't initialize instance of K8sClient", error)
      throw error
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
      throw new GenericK8sException(err.message)
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
    const yamls = loadYamls({ CLIENT_NAME: resourceName, DOMAIN_NAME: domainName, ALB_DNS: Env.get('ALB_DNS') })
    await this.certificate.createCertificate(yamls['03Certificate.yml'])
    await this.ingress.createIngress(yamls['04Ingress.yml'])
  }
}
