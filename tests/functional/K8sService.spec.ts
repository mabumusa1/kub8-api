import { test } from '@japa/runner'
import K8sClient from 'App/Services/K8sClient'
test.group('K8s Client Init', () => {
  test('K8sClient Init Wrong').run(async ({ assert }) => {
    await assert.rejects(async () => {
      K8sClient.state = 'PENDING'
      await K8sClient.initialize()
    })
  })
})
