import { test } from '@japa/runner'
import nock from 'nock'
test.group('Resize', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })

  test('Resize.validation')
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
          size: { cpu: 2, memory: '1Mi' },
        },
        errors: 1,
        responseCode: 422,
      },
      {
        payload: {
          id: 'iab',
          payload: { size: { cpu: 'ss', memory: '1Mix' } },
        },
        errors: 1,
        responseCode: 422,
      },
    ])
    .run(async ({ client, assert }, testObject) => {
      const response = await client.post('/v1/install/resize').json(testObject.payload)
      response.assertStatus(testObject.responseCode)
      assert.equal(response.body().errors.length, testObject.errors)
    })
})
