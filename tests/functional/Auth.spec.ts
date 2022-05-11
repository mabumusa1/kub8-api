import { test } from '@japa/runner'
import nock from 'nock'
import { ApiClient } from '@japa/api-client'
import { base64 } from '@ioc:Adonis/Core/Helpers'
import Env from '@ioc:Adonis/Core/Env'

test.group('Auth', (group) => {
  group.each.setup(() => {
    nock.cleanAll()
    ApiClient.clearSetupHooks()
    ApiClient.clearTeardownHooks()
    ApiClient.clearRequestHandlers()
  })

  group.each.teardown(() => {
    nock.cleanAll()
    nock.enableNetConnect()
    ApiClient.setup(async (request) => {
      const token = Env.get('TOKEN')
      request.bearerToken(base64.encode(token))
    })
  })

  test('create.failed authenticate', async ({ client }) => {
    const response = await client
      .post('/v1/install/create')
      .json({})
      .setup(async (request) => {
        request.bearerToken('wrong')
      })

    response.assertStatus(401)
  })

  test('create.failed authenticate password', async ({ client }) => {
    const response = await client.post('/v1/install/create').json({})

    response.assertStatus(401)
  })
})
