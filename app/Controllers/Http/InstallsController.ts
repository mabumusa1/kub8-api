import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import UpdateInstallValidator from 'App/Validators/UpdateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import AppV1Api from '@ioc:App/API/V1'
export default class InstallsController {
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
