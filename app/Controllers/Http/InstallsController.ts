import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import UpdateInstallValidator from 'App/Validators/UpdateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import K8sClient from '@ioc:K8s/Client'
import Logger from '@ioc:Adonis/Core/Logger'

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
    try {
      await K8sClient.canCreateInstall(request.input('id'))
      await K8sClient.createInstall(request.input('id'))

      response.created({
        status: 'success',
        message: 'Install create request accepted',
      })
    } catch (err) {
      response.status(500).json({ message: err.message })
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
    //await request.validate(CreateInstallValidator)
    /* Todo
      
    
    Add validation to verify id parameter



    */
    //console.log(request.qs())
    //console.log(request.param('id'))
    try {
      await K8sClient.rollBackInstall(request.param('id'))

      response.created({
        status: 'success',
        message: 'Install destroy request accepted',
      })
    } catch (err) {
      response.status(500).json({ message: err.message })
    }
    //console.log(request)
  }

  public async copy({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    response.created({
      status: 'success',
      message: 'Install copy request accepted',
    })
  }

  public async stop({ request, response }: HttpContextContract) {
    // Ingress like htaccesss
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install stop request accepted',
    })
  }

  public async backup({ request, response }: HttpContextContract) {
    /*
      Prepare bash script for DB backup and file backup and push it to S3, and send web hook to laravel
      param: client_name

      return: s3 uri (directory contains 2 files)
    */
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install backup request accepted',
    })
  }

  public async setDomain({ request, response }: HttpContextContract) {
    await request.validate(SetDomainValidator)
    try {
      await K8sClient.rollBackInstall45545(request.input('id'))

      response.created({
        status: 'success',
        message: 'Domain mapping request accepted',
      })
    } catch (err) {
      response.status(500).json({ message: err.message })
    }
    
  }
}
