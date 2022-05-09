import { test } from '@japa/runner'
import { mockDeleteKubApi } from '../test_helpers/mock'

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
})
