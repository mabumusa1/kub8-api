import { test } from '@japa/runner'

test.group('SetDomain', (group) => {
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
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'setDomain: Error Creating Ingress Kub8 Error',
    })
  })
})
