import { AppsV1Api, KubeConfig, V1StatefulSet } from '@kubernetes/client-node'
import { join } from 'path'
import { readFileSync } from 'fs-extra'
import { load } from 'js-yaml'
import { extend } from 'lodash'
export default class AppApi {
  protected apiClient: AppsV1Api

  public createClient() {
    const envVars = {
      contexts: [{ cluster: 'cluster', user: 'user', name: 'loaded-context' }],
      clusters: [{ name: 'cluster', server: 'http://localhost:8001' }],
      users: [{ name: 'user' }],
      currentContext: 'loaded-context',
    }
    const kc = new KubeConfig()
    kc.loadFromOptions(envVars)

    this.apiClient = kc.makeApiClient(AppsV1Api)
    return this.apiClient
  }

  public loadState(name: String) {
    const state = new V1StatefulSet()
    const file = join(__dirname, '..', 'stateful-set', `${name}.yml`)
    console.log(file)
    var data: any = load(readFileSync(file, 'utf8'))
    console.log(data)
    data.metadata.name = 'xxx'
    console.log(data)
    extend(state, data)
    return state
  }

  public getClient() {
    return this.apiClient
  }
}
