import { Exception } from '@adonisjs/core/build/standalone'
import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { types } from '@ioc:Adonis/Core/Helpers'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new K8sErrorException('message', 500, 'E_K8S_EXCEPTION')
|
*/
export default class K8sErrorException extends Exception {
  private params: object
  private requestId: any

  public async handle(error: this, ctx: HttpContextContract) {
    this.params = ctx.request.all()
    this.requestId = ctx.request.header('x-request-id')

    ctx.response.status(this.status).json({ status: 'error', message: error.message })
  }
  public report(error: this) {
    Logger.fatal('%o', {
      'requestId ': error.requestId,
      'params ': error.params,
      'message': error.message,
      'stack': error.stack,
    })
  }
}
