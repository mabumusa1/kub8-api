import { test } from '@japa/runner'

test.group('Backups', () => {
  test('Backup.validation', async ({ client, assert }, testObject: Object) => {
    const response = await client.post('/v1/install/backup').json(testObject.payload)
    response.assertStatus(testObject.responseCode)
    assert.equal(response.body().errors.length, testObject.errors)
  }).with([
    {
      payload: {
        id: 'iab',
      },
      errors: 1,
      responseCode: 422,
    },
    {
      payload: {
        source: 'automated',
      },
      errors: 1,
      responseCode: 422,
    },
    {
      payload: {
        id: 'iab',
        source: 'wrong',
      },
      errors: 1,
      responseCode: 422,
    },
  ])

  test('Backup.success', async ({ client }) => {
    const response = await client.post('/v1/install/backup').json({
      id: 'iab',
      source: 'automated',
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install backup request accepted',
    })
  })
})
