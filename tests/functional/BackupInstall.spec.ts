import { test } from '@japa/runner'
import nock from 'nock'
test.group('Backups', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })

  test('Backup.validation')
    .with([
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
    .run(async ({ client, assert }, testObject) => {
      const response = await client.post('/v1/install/backup').json(testObject.payload)
      response.assertStatus(testObject.responseCode)
      assert.equal(response.body().errors.length, testObject.errors)
    })

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
