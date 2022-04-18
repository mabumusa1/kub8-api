import { AppsV1Api, KubeConfig, V1StatefulSet , CoreV1Api, V1Service, CustomObjectsApi, NetworkingV1Api } from '@kubernetes/client-node'
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
  protected NetworkingV1Api: NetworkingV1Api

  constructor(config: typeof K8sConfig) {
    const kc = new KubeConfig()
    kc.loadFromOptions(config)

    this.AppsV1Api = kc.makeApiClient(AppsV1Api)
    this.CoreV1Api = kc.makeApiClient(CoreV1Api)
    this.CustomObjectsApi = kc.makeApiClient(CustomObjectsApi)
    this.NetworkingV1Api = kc.makeApiClient(NetworkingV1Api)
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
    //console.log('isStatefulSetExist ' + JSON.stringify(this.AppsV1Api.listNamespacedStatefulSet('default'), null, 4))
    const state = new V1StatefulSet()
    extend(state, data)
    return this.AppsV1Api.createNamespacedStatefulSet('default', state)
  }

  public async isStatefulSetExist(resourceName: String){
    this.AppsV1Api.readNamespacedStatefulSet(resourceName, 'default').then((res) => {
        throw new Error(resourceName + ' StatefulSet Exists.')
    }).catch((err) => {
      if (err['statusCode'] === 404){
        console.log(resourceName + ' StatefulSet Not Exists.')
      }
      else {
        console.log(err)
      }
    })
  }

  public async isServiceExist(resourceName: String){
    this.CoreV1Api.readNamespacedService(resourceName, 'default').then((res) => {
        throw new Error(resourceName + ' Service Exists.')
    }).catch((err) => {
      if (err['statusCode'] === 404){
        console.log(resourceName + ' Service Not Exists.')
      }
      else {
        console.log(err)
      }
    })
  }

  public async isIngressExist(resourceName: String){
    return this.NetworkingV1Api.readNamespacedIngress(resourceName, 'default');
    this.NetworkingV1Api.readNamespacedIngress(resourceName, 'default').then((res) => {
      if (res['body'].metadata.name === resourceName){
        console.log(resourceName + ' Ingress Exists.')
        return true;
      }
    }).catch((err) => {
      if (err['statusCode'] === 404){
        console.log(resourceName + ' Ingress Not Exists.')
        return false
      }
      else {
        console.log(err)
      }
    })
  }

  public async isCertificateExist(resourceName: String){
    return this.CustomObjectsApi.getNamespacedCustomObject("cert-manager.io", "v1", "default", "certificates", resourceName);
    this.CustomObjectsApi.getNamespacedCustomObject("cert-manager.io", "v1", "default", "certificates", resourceName).then((res) => {
      if (res['body'].metadata.name === resourceName){
        console.log(resourceName + ' Certificate Exists.')
        return true;
      }
    }).catch((err) => {
      if (err['statusCode'] === 404){
        console.log(resourceName + ' Certificate Not Exists.')
        return false
      }
      else {
        console.log(err)
      }
    })
  }

  public createService(data: Object) {
    const state = new V1Service()
    extend(state, data)
    return this.CoreV1Api.createNamespacedService('default', state)
  }

  public createCertificate(data: Object) {
    const state = new CustomObjectsApi()
    extend(state, data)
    return this.CustomObjectsApi.createNamespacedCustomObject("cert-manager.io", "v1", "default", "certificates", state)
  }

  public createIngress(data: Object) {
    const state = new NetworkingV1Api() 
    extend(state, data)
    return this.NetworkingV1Api.createNamespacedIngress('default', state)
  }

  public getClient() {
    return this.AppsV1Api
  }
}
