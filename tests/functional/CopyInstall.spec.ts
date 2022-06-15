import { test } from '@japa/runner'
import nock from 'nock'
test.group('Copy', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })

  test('Copy.validation')
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
    ])
    .run(async ({ client, assert }, content) => {
      const response = await client.post('/v1/install/copy').json(content.payload)
      response.assertStatus(content.responseCode)
      assert.equal(response.body().errors.length, content.errors)
    })

  test('Copy.custom size ignore if size defined', async ({ client }) => {
    const response = await client.post('/v1/install/copy').json({
      id: 'iab',
      env_type: 'dev',
      domain: 'domain.com',
      size: 's1',
      custom: {
        cpu: '1',
        memory: '12',
      },
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install copy request accepted',
    })
  })

  test('Copy.custom install size is defined the custom object must be exist', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/v1/install/copy').json({
      id: 'iab',
      env_type: 'dev',
      domain: 'domain.com',
      size: 'custom',
    })
    response.assertStatus(422)
    assert.equal(response.body().errors.length, 1)
  })

  test('Copy.success', async ({ client }) => {
    const response = await client.post('/v1/install/copy').json({
      id: 'iab',
      env_type: 'stg',
      size: 's1',
      domain: 'domain.com',
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install copy request accepted',
    })
  })
})
