import { AppsV1Api, KubeConfig, V1StatefulSet } from '@kubernetes/client-node'
import { types } from '@ioc:Adonis/Core/Helpers'
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

  public loadYaml(fileName: String, replace?: Object): Object {
    const file = join(__dirname, '../..', 'yamls', `${fileName}.yml`)
    const template = readFileSync(file, 'utf8')    
    var data = null;
    if (types.isObject(replace)) {
      const re = new RegExp(replace.find,"g");
      data = load(template.replace(re, replace.replace))
    }else{
      data =  load(template)
    }
    return data
  }

  public createStateful(data: Object) {
    const state = new V1StatefulSet()
    extend(state, data)
    return this.apiClient.createNamespacedStatefulSet('default', state)
  }

  public getClient() {
    return this.apiClient
  }
}
