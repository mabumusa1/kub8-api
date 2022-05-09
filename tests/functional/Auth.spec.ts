import { test } from '@japa/runner'

test.group('Auth', () => {
  test('create.success authenticate', async ({ client }) => {
    const response = await client.post('/v1/install/create').json({})
    response.assertStatus(422)
  })
})
