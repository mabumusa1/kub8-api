import { test } from '@japa/runner'
import http from 'http'

test.group('Check Health', () => {
  test('health.can_connect.true').run(async ({ client }) => {
    const server = http
      .createServer((_, response) => {
        response.writeHead(200).end()
      })
      .listen(8001)
    const response = await client.get('health')
    response.assertStatus(200)
    response.assertBodyContains({
      healthy: true,
      report: {
        k8s_api_can_connect: {
          displayName: 'K8s can connect Check',
          health: {
            healthy: true,
          },
        },
      },
    })

    server.close()
  })

  test('health.can_not_connect.true').run(async ({ client }) => {
    const response = await client.get('health')
    response.assertStatus(400)
    response.assertBodyContains({
      healthy: false,
      report: {
        k8s_api_can_connect: {
          displayName: 'K8s can connect Check',
          health: {
            healthy: false,
          },
        },
      },
    })
  })
})
