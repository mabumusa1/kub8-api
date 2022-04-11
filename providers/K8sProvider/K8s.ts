import { AppsV1Api, KubeConfig, V1StatefulSet, CoreV1Api, CustomObjectsApi, ExtensionsV1beta1Api } from '@kubernetes/client-node'
import { types } from '@ioc:Adonis/Core/Helpers'
import { join } from 'path'
import { readFileSync } from 'fs-extra'
import { load } from 'js-yaml'
import { extend } from 'lodash'
import { K8sConfig } from 'Config/k8s'

export default class K8sWrapper {
  protected AppsV1Api: AppsV1Api
  protected CoreV1Api: CoreV1Api
  protected CustomObjectsApi: CustomObjectsApi
  protected ExtensionsV1beta1Api: ExtensionsV1beta1Api

  constructor(config: typeof K8sConfig) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)

    this.AppsV1Api = kc.makeApiClient(AppsV1Api)
    this.CoreV1Api = kc.makeApiClient(CoreV1Api)
    this.CustomObjectsApi = kc.makeApiClient(CustomObjectsApi)
    //this.ExtensionsV1beta1Api = kc.makeApiClient(ExtensionsV1beta1Api)
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
    return this.AppsV1Api.createNamespacedStatefulSet('default', state)
  }

  public createService(data: Object) {
    const state = new V1StatefulSet()
    extend(state, data)
    return this.CoreV1Api.createNamespacedService('default', state)
  }

  public createCertificate(data: Object) {
    const state = new V1StatefulSet()
    extend(state, data)
    return this.CustomObjectsApi.createNamespacedCustomObject("cert-manager.io", "v1", "default", "certificates", state)
  }

  public createIngress(data: Object) {
    const state = new V1StatefulSet()
    extend(state, data)
    return this.ExtensionsV1beta1Api.createNamespacedIngress('default', state)
  }

  public getClient() {
    return this.AppsV1Api
  }
}
