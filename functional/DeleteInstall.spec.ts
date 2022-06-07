import { test } from '@japa/runner'

test.group('Delete', (group) => {
  test('Delete.validation', async ({ client }) => {
    const response = await client.delete('/v1/install/iab$$#/delete')
    response.assertStatus(404)
  })

  test('Delete.success', async ({ client }) => {
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  })

  test('Delete.failed', async ({ client }) => {
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Stateful Kub8 Error',
    })
  })

  test('Delete.failed', async ({ client }) => {
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Stateful Kub8 Error',
    })
  })

  test('Delete.failed.service', async ({ client }) => {
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Service Kub8 Error',
    })
  })

  test('Delete.failed.ingress', async ({ client }) => {
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Ingress Kub8 Error',
    })
  })

  test('Delete.failed.certificate', async ({ client }) => {
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Certificate Kub8 Error',
    })
  })
})
