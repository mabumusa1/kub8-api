import { AppsV1Api, KubeConfig, V1StatefulSet } from '@kubernetes/client-node'
import { join } from 'path'
import { readFileSync } from 'fs-extra'
import { load } from 'js-yaml'
import { extend } from 'lodash'
import { K8sConfig } from 'Config/k8s'

export default class K8sWrapper {
  protected apiClient: AppsV1Api

  constructor(config: typeof K8sConfig) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)

    this.apiClient = kc.makeApiClient(AppsV1Api)
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

  public createStateful(state: V1StatefulSet) {
    return this.apiClient.createNamespacedStatefulSet('default', state)
  }

  public getClient() {
    return this.apiClient
  }
}
