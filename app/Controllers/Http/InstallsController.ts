import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'

export default class InstallsController {
  public async create({ request, response }) {
    const payload = await request.validate(CreateInstallValidator)

    return response.created('Install creation request accepted')
  }

  public async update({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateInstallValidator)
    const id = request.qs().id
    if (!id) {
      return response.badRequest('id is required')
    } else {
      if (id !== 'iab') {
        return response.notFound('Install not found')
      }
    }
    response.created('Install resize request accepted')
  }

  public async delete({ request, response }: HttpContextContract) {
    const id = request.qs().id
    if (!id) {
      return response.badRequest('id is required')
    } else {
      if (id !== 'iab') {
        return response.notFound('Install not found')
      }
    }
    response.created('Install destroy request accepted')
  }

  public async copy({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateInstallValidator)
    const id = request.qs().id
    if (!id) {
      return response.badRequest('id is required')
    } else {
      if (id !== 'iab') {
        return response.notFound('Source not found')
      }
    }
    response.created('Install destroy request accepted')
  }

  public async stop({ request, response }: HttpContextContract) {
    const id = request.qs().id
    const source = request.qs().source ?? 'automated'
    if (!id) {
      return response.badRequest('id is required')
    } else {
      if (id !== 'iab') {
        return response.notFound('Install not found')
      }
    }
    response.created('Install stop request accepted')
  }

  public async backup({ request, response }: HttpContextContract) {
    const id = request.qs().id
    if (!id) {
      return response.badRequest('id is required')
    } else {
      if (id !== 'iab') {
        return response.notFound('Install not found')
      }
    }
    response.created('Install backup request accepted')
  }

  public async setDomain({ request, response }: HttpContextContract) {
    const id = request.qs().id
    if (!id) {
      return response.badRequest('id is required')
    } else {
      if (id !== 'iab') {
        return response.notFound('Source not found')
      }
    }
    response.created('Domain mapping request accepted')
  }
}
