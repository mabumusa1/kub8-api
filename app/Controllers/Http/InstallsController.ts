import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import UpdateInstallValidator from 'App/Validators/UpdateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import K8sClient from '@ioc:K8s/Client'

export default class InstallsController {
  /**
   * Creates a new install based on the pass parameters
   * It runs several pre-flight checks to make sure the install can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   * @return  {HttpContextContract}             the response object
   */
  public async create({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    const check = await K8sClient.preFlightCheck('moe')
    if (check === true) {
      // execeute the create
      response.created({
        status: 'success',
        message: 'Install create request accepted',
      })
    } else {
      response.abort('Prefilght check failed')
    }
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
