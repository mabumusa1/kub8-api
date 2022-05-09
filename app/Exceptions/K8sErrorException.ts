import { Exception } from '@adonisjs/core/build/standalone'
import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new K8sErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class K8sErrorException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(error.status).send(error.message)
  }

  public report(error: this) {
    Logger.fatal(error.message)
  }
}
