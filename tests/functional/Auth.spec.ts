import { test } from '@japa/runner'

test.group('Auth', () => {
  test('create.success authenticate', async ({ client }) => {
    const response = await client
      .post('/v1/install/create')
      .basicAuth('username', 'password')
      .json({})
    response.assertStatus(422)
  })

  test('create.fail authenticate', async ({ client }) => {
    const response = await client.post('/v1/install/create').basicAuth('username', 'xxx').json({})
    response.assertStatus(401)
  })
})
