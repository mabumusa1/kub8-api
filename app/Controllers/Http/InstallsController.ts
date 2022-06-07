import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import BackupValidator from 'App/Validators/BackupValidator'
import K8sClient from '@ioc:K8s/K8sClient'

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
    await K8sClient.createInstall(request.input('id'))
    response.created({
      status: 'success',
      message: 'Install create request accepted',
    })
  }

  /**
   * Delete an install based on the pass parameters
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   * @return  {HttpContextContract}             the response object
   */
  public async delete({ request, response }: HttpContextContract) {
    await K8sClient.deleteInstall(request.param('id'))

    response.created({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  }

  /**
   * Copy an install based on the pass parameters
   * It runs several pre-flight checks to make sure the install can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   * @return  {HttpContextContract}             the response object
   */
  public async copy({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    response.created({
      status: 'success',
      message: 'Install copy request accepted',
    })
  }

  /**
   * Backup an install based on the pass parameters
   * It runs several pre-flight checks to make sure the install can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   * @return  {HttpContextContract}             the response object
   */
  public async backup({ request, response }: HttpContextContract) {
    /*
      Prepare bash script for DB backup and file backup and push it to S3, and send web hook to laravel
      param: client_name

      return: s3 uri (directory contains 2 files)
    */

    await request.validate(BackupValidator)

    response.created({
      status: 'success',
      message: 'Install backup request accepted',
    })
  }

  /**
   * Set a domain to an install based on the pass parameters
   * It runs several pre-flight checks to make sure the install can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   * @return  {HttpContextContract}             the response object
   */
  public async setDomain({ request, response }: HttpContextContract) {
    await request.validate(SetDomainValidator)
    await K8sClient.setDomain(request.input('id'), request.input('domain'))

    response.created({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  }
}
