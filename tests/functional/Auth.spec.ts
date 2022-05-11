import { test } from '@japa/runner'
import nock from 'nock'

test.group('Auth', (group) => {
  group.each.setup(() => {
    nock.cleanAll()
  })

  group.each.teardown(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  test('create.success authenticate', async ({ client }) => {
    const response = await client.post('/v1/install/create').json({})
    response.assertStatus(422)
  })

  test('create.failed authenticate', async ({ client }) => {
    const response = await client
      .post('/v1/install/create')
      .json({})
      .setup(async (request) => {
        request.basicAuth('wrong', 'wrong')
      })
    response.assertStatus(401)
  })

  test('create.failed authenticate password', async ({ client }) => {
    const response = await client
      .post('/v1/install/create')
      .json({})
      .setup(async (request) => {
        request.basicAuth('username', 'wrong')
      })
    response.assertStatus(401)
  })
})
