import { test } from '@japa/runner'
import K8sErrorException from 'App/Exceptions/K8sErrorException'

test.group('Exception', () => {
  test('create.raise exception', async ({ client }) => {
    const response = await client.post('/v1/install/create').json({
      id: 'iab',
      env_type: 'dev',
      domain: 'domain.com',
      size: 's1',
      custom: {
        cpu: '1',
        memory: '12',
      },
    })
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
    })
  })
})
