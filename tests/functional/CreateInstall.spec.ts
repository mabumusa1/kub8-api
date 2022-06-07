import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
test.group('Create', (group) => {
  group.each.setup(() => {
    nock.load(path.join(__dirname, '..', '', 'helpers/__tapes__/create.tape.json'))
    nock.disableNetConnect()
    nock.enableNetConnect('0.0.0.0')
  })
  test('Create.validation')
    .with([
      {
        payload: {},
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { env_type: 'test' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { env_type: 'stg' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: { size: '5' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { size: 's5' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: { domain: 'domain.com' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: { domain: 'domain' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { domain: 'some-region' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: {
          id: 'iab',
          env_type: 'dev',
          domain: 'domain.com',
          size: 'custom',
        },
        errors: 1,
        responseCode: 422,
      },
    ])
    .run(async ({ client, assert }, content) => {
      const response = await client.post('/v1/install/create').json(content.payload)
      response.assertStatus(content.responseCode)
      assert.equal(response.body().errors.length, content.errors)
    })

  test('create.success')
    .with([
      {
        id: 'recorder2',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
      {
        id: 'recorder2',
        env_type: 'dev',
        domain: 'domain.com',
        size: 's1',
        custom: {
          cpu: '1',
          memory: '12',
        },
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(201)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Install create request accepted',
      })
      // TODO: Assert custom size is created
    })
})
