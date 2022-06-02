import { test } from '@japa/runner'
import {
  mockSetDomainKubApi,
  mockSetDomainKubApiFailed,
  mockSetDomainKubApiFailedIngress,
} from '../test_helpers/mock'
import nock from 'nock'
test.group('SetDomain', (group) => {
  group.each.setup(() => {
    nock.cleanAll()
  })

  group.each.teardown(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  test('SetDomain.validation')
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
          domain: 'domain.com',
        },
        errors: 1,
        responseCode: 422,
      },
      {
        payload: {},
        errors: 2,
        responseCode: 422,
      },
    ])
    .run(async ({ client, assert }, testObject) => {
      mockSetDomainKubApi()
      const response = await client.post('/v1/install/setDomain').json(testObject.payload)
      response.assertStatus(testObject.responseCode)
      assert.equal(response.body().errors.length, testObject.errors)
    })

  test('SetDomain.success', async ({ client }) => {
    mockSetDomainKubApi()
    const response = await client.post('/v1/install/setDomain').json({
      id: 'iab',
      domain: 'domain.com',
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  })

  test('SetDomain.failed', async ({ client }) => {
    mockSetDomainKubApiFailed()
    const response = await client.post('/v1/install/setDomain').json({
      id: 'iab',
      domain: 'domain.com',
    })
    console.log(response.body)
    response.assertStatus(412)
    response.assertAgainstApiSpec()
  })

  test('SetDomain.failed.ingress', async ({ client }) => {
    mockSetDomainKubApiFailedIngress()
    const response = await client.post('/v1/install/setDomain').json({
      id: 'iab',
      domain: 'domain.com',
    })
    response.assertStatus(412)
    response.assertAgainstApiSpec()
  })
})
