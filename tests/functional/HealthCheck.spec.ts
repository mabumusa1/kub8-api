import { test } from '@japa/runner'
import nock from 'nock'
import Env from '@ioc:Adonis/Core/Env'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'

test.group('Check Health', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
  })

  test('health.can_connect.true').run(async ({ client }) => {
    nock(Env.get('K8S_API_URL')).get('/livez').reply(200, 'ok')
    const response = await client.get('health')
    response.assertStatus(200)
    response.assertBodyContains({
      healthy: true,
      report: {
        k8s_server: {
          displayName: 'K8s Health',
          health: {
            healthy: true,
            message: 'ok',
          },
        },
      },
    })
  })

  test('health.can_connect.false').run(async ({ client }) => {
    nock(Env.get('K8S_API_URL')).get('/livez').replyWithError('something awful happened')

    const response = await client.get('health')
    response.assertStatus(400)
    response.assertBodyContains({
      healthy: false,
      report: {
        k8s_server: {
          displayName: 'K8s Health',
          health: {
            healthy: false,
            message: 'something awful happened',
          },
        },
      },
    })
  })
})
