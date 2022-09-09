import { test } from '@japa/runner'
import K8sClient from 'App/Services/K8sClient'
import nock from 'nock'
test.group('K8s Client Init', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })
  test('K8sClient Init Wrong').run(async ({ assert }) => {
    nock('https://eks.ap-south-1.amazonaws.com').get('/clusters/SteerCampaignDev').reply(404, {})
    await assert.rejects(async () => {
      K8sClient.state = 'PENDING'
      await K8sClient.initialize()
    })
  })
})
