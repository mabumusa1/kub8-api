import { test } from '@japa/runner'
import { mockCreateKubApiSuccess, mockCreateKubApiFailed } from '../test_helpers/mock'
import nock from 'nock'
test.group('Create', (group) => {
  group.each.setup(() => {
    nock.cleanAll()
  })

  group.each.teardown(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  test('Create.validation', async ({ client, assert }, content) => {
    const response = await client.post('/v1/install/create').json(content.payload)
    response.assertStatus(content.responseCode)
    assert.equal(response.body().errors.length, content.errors)
  }).with([
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

  test('create.success', async ({ client }, content) => {
    mockCreateKubApiSuccess()
    const response = await client.post('/v1/install/create').json(content)

    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install create request accepted',
    })
    // TODO: Assert custom size is created
  }).with([
    {
      id: 'iab',
      env_type: 'stg',
      size: 's1',
      domain: 'domain.com',
    },
    {
      id: 'iab',
      env_type: 'dev',
      domain: 'domain.com',
      size: 's1',
      custom: {
        cpu: '1',
        memory: '12',
      },
    },
  ])

  test('create.failed', async ({ client }, content) => {
    mockCreateKubApiFailed()
    const response = await client.post('/v1/install/create').json(content)

    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'canCreateInstall: Error Checking Stateful Kub8 Error',
    })
  }).with([
    {
      id: 'iab',
      env_type: 'stg',
      size: 's1',
      domain: 'domain.com',
    },
  ])
})
