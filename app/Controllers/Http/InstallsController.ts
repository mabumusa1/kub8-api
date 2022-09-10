import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import BackupValidator from 'App/Validators/BackupValidator'
import K8sClient from 'App/Services/K8sClient'
import LockValidator from 'App/Validators/LockValidator'
import UnlockValidator from 'App/Validators/UnlockValidator'
export default class InstallsController {
  private k8sClient: K8sClient
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
    this.k8sClient = await K8sClient.initialize()
    await this.k8sClient.createInstall(request.input('id'))
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
    this.k8sClient = await K8sClient.initialize()
    await this.k8sClient.deleteInstall(request.param('id'))
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
   * It runs several pre-flight checks to make sure the domain can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   * @return  {HttpContextContract}             the response object
   */
  public async setDomain({ request, response }: HttpContextContract) {
    await request.validate(SetDomainValidator)
    this.k8sClient = await K8sClient.initialize()
    await this.k8sClient.setDomain(request.input('id'), request.input('domain'))
    response.created({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  }

  /**
   * Lock an install based on the pass parameters
   * It runs several pre-flight checks to make sure the lock can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   *  @return  {HttpContextContract}             the response object
   */

  public async lock({ request, response }: HttpContextContract) {
    await request.validate(LockValidator)
    this.k8sClient = await K8sClient.initialize()
    await this.k8sClient.lockInstall(request.input('id'), request.input('password'))
    response.created({
      status: 'success',
      message: 'Lock request accepted',
    })
  }

  /**
   * Unlock an install based on the pass parameters
   * It runs several pre-flight checks to make sure the install can be created
   *
   * @param   {HttpContextContract}  request   the incoming request object
   * @param   {HttpContextContract}  response  the response we send back to the client
   *
   *  @return  {HttpContextContract}             the response object
   */

  public async unlock({ request, response }: HttpContextContract) {
    await request.validate(UnlockValidator)
    this.k8sClient = await K8sClient.initialize()
    await this.k8sClient.unLockInstall(request.input('id'))
    response.created({
      status: 'success',
      message: 'Unlock request accepted',
    })
  }
}
