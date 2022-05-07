import { test } from '@japa/runner'
import { mockSetDomainKubApi } from '../test_helpers/mock'

test.group('SetDomain', () => {
  test('SetDomain.validation', async ({ client }) => {
    const response = await client.post('/v1/install/iab#/setdomain')
    response.assertStatus(404)
  })

  test('SetDomain.invalidDomain', async ({ client }) => {
    const response = await client.post('/v1/install/iab/setdomain').json({
      domain: 'domain',
    })
    response.assertStatus(422)
  })

  test('SetDomain.success', async ({ client }) => {
    mockSetDomainKubApi()
    const response = await client.post('/v1/install/iab/setdomain').json({
      domain: 'domain.com',
    })
    response.assertStatus(201)
    // TODO: fix this by fixing the openapi spec
    //    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  })
})
