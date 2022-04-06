import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path = require('path')
import yaml = require('js-yaml')
import fs = require('fs-extra')
import _ = require('lodash')

const k8s = require('@kubernetes/client-node')

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import UpdateInstallValidator from 'App/Validators/UpdateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import { V1StatefulSet } from '@kubernetes/client-node'
import AppV1Api from '@ioc:App/API/V1'
export default class InstallsController {
  /* private loadState(name: string): V1StatefulSet {
    const state = new k8s.V1StatefulSet()
    const file = path.join(__dirname, 'stateful-set', `${name}.yml`)
    console.log(file)
    var data = yaml.load(fs.readFileSync(file, 'utf8'))
    console.log(data)
    data.metadata.name = 'xxx'
    console.log(data)
    _.extend(state, data)
    return state
  } */

  /* private createClient() {
    const envVars = {
      contexts: [{ cluster: 'cluster', user: 'user', name: 'loaded-context' }],
      clusters: [{ name: 'cluster', server: 'http://localhost:8001' }],
      users: [{ name: 'user' }],
      currentContext: 'loaded-context',
    }
    const kc = new k8s.KubeConfig()
    kc.loadFromOptions(envVars)

    const appsV1Api = kc.makeApiClient(k8s.AppsV1Api)
    return appsV1Api
  } */

  private createStateful() {
    AppV1Api.createClient()
      .createNamespacedStatefulSet('default', state)
      .then(function (res) {
        console.log('body', res.body)
        return
      })
      .catch(function (err) {
        console.log('error', err.body)
      })
  }

  public async create({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    const state = AppV1Api.loadState('nginx')
    //   this.createClient()
    //this.createStateful()
    //const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    return response.created({
      status: 'success2',
      message: 'Install creation request accepted',
    })
  }

  public async update({ request, response }: HttpContextContract) {
    await request.validate(UpdateInstallValidator)
    response.created({
      status: 'success',
      message: 'Install resize request accepted',
    })
  }

  public async delete({ request, response }: HttpContextContract) {
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  }

  public async copy({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    response.created({
      status: 'success',
      message: 'Install copy request accepted',
    })
  }

  public async stop({ request, response }: HttpContextContract) {
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install stop request accepted',
    })
  }

  public async backup({ request, response }: HttpContextContract) {
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install backup request accepted',
    })
  }

  public async setDomain({ request, response }: HttpContextContract) {
    await request.validate(SetDomainValidator)
    response.created({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  }
}
