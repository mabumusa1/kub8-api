import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { base64 } from '@ioc:Adonis/Core/Helpers'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const bearer = (request.headers && request.headers()['authorization']) || null
    if (bearer) {
      const requestToken = bearer.replace('Basic ', '')      
      const token = base64.encode(Env.get('TOKEN'))
      if (requestToken !== token) {
        return response.unauthorized({ status: 'error', message: 'Invalid access token' })
      }
    } else {
      return response.unauthorized({ status: 'error', message: 'Invalid access token' })
    }
    await next()
  }
}
