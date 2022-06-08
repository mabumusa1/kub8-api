import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new GenericK8sException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class GenericK8sException extends Exception {
  private params: any
  private requestId: any
  public async handle(error: this, ctx: HttpContextContract) {
    this.params = ctx.request.all()
    this.requestId = ctx.request.header('x-request-id')
    ctx.response.status(412).json({ status: 'error', message: error.message })
  }
  public report(error: this) {
    Logger.fatal('%o', {
      'requestId ': this.requestId,
      'params ': this.params,
      'message ': error.message,
    })
  }
}
