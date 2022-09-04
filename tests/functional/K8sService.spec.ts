import { test } from '@japa/runner'
import K8sClient from 'App/Services/K8sClient'
test.group('K8s Client Init', (group) => {
  test('K8sClient Init Wrong').run(async ({ assert }) => {
    await assert.rejects(async () => {
      await K8sClient.initialize()
    })
  })
})
