import { CoreV1Api, KubeConfig, V1Secret, NetworkingV1Api, V1Ingress } from '@kubernetes/client-node'
import { extend } from 'lodash'
import K8sErrorException from 'App/Exceptions/K8sErrorException'
import crypto from 'crypto'
import { base64 } from '@ioc:Adonis/Core/Helpers'

export class Lock {
    protected CoreV1ApiClient: CoreV1Api
    protected NetworkingV1ApiClient: NetworkingV1Api

    constructor(kc: KubeConfig) {
        this.CoreV1ApiClient = kc.makeApiClient(CoreV1Api)
        this.NetworkingV1ApiClient = kc.makeApiClient(NetworkingV1Api)
      }

      
  /**
   * Create a Ingress based on the yaml file passed
   *
   * @param   {Object}  data  data yaml file content as an object
   *
   */

  public async createLock(data: Object) {
    const state = new V1Secret()
    extend(state, data)

    return await this.CoreV1ApiClient.createNamespacedSecret('default', state)
      .then(() => {
        return true
      })
      .catch((err) => {
          console.log(err.body)
        throw new K8sErrorException('Error Creating Secret ' + err.body)
      })
  }

  public async attachLock(resourceName: string, data: Object){
    const state = new V1Ingress()
    extend(state, data)
    return await this.NetworkingV1ApiClient.patchNamespacedIngress(resourceName, 'default', state)
    .then(() => {
        return true
    })
    .catch((err) => {
        console.log(err)
        throw new K8sErrorException('Error Attaching Lock ' + err.body)
    })
  }

  public createHash(password: string) : string{
    let hash = crypto.createHash('sha1')
    hash.update(password)
    const hashedPassed = '{SHA}' + hash.digest('base64')
    return base64.encode(hashedPassed)
  }
}
