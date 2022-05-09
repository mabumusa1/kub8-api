import { test } from '@japa/runner'
import { mockSetDomainKubApi } from '../test_helpers/mock'

test.group('SetDomain', () => {
  test('SetDomain.validation', async ({ client, assert }, testObject: Object) => {
    mockSetDomainKubApi()
    const response = await client.post('/v1/install/setDomain').json(testObject.payload)
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
})
