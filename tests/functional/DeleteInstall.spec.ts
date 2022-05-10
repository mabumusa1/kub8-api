import { test } from '@japa/runner'
import { mockDeleteKubApi, mockDeleteKubApiFailed } from '../test_helpers/mock'

test.group('Delete', () => {
  test('Delete.validation', async ({ client }) => {
    const response = await client.delete('/v1/install/iab$$#/delete')
    response.assertStatus(404)
  })

  test('Delete.success', async ({ client }) => {
    mockDeleteKubApi()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  })

  test('Delete.failed', async ({ client }) => {
    mockDeleteKubApiFailed()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'E_K8S_EXCEPTION: Error deleting Stateful Kub8 Error',
    })
  })
})
