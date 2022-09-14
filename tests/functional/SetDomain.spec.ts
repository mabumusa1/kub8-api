import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'

test.group('SetDomain', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
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
      const response = await client.post('/v1/install/setDomain').json(testObject.payload)
      response.assertStatus(testObject.responseCode)
      assert.equal(response.body().errors.length, testObject.errors)
    })

  test('SetDomain.success', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
    nock.load(
      path.join(
        __dirname,
        '..',
        '',
        'helpers/kub8Response/certificate/get-certificate-setDomain.json'
      )
    )

    nock.load(
      path.join(
        __dirname,
        '..',
        '',
        'helpers/kub8Response/certificate/create-success-setDomain.json'
      )
    )
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/ingress/create-success-setDomain.json')
    )

    const response = await client.post('/v1/install/setDomain').json({
      id: 'recorder3',
      domain: 'domain.com',
    })
    console.log(response.body())
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  })

  test('SetDomain.certificate.failed', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
    nock.load(
      path.join(
        __dirname,
        '..',
        '',
        'helpers/kub8Response/certificate/get-certificate-setDomain.json'
      )
    )

    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/certificate/create-fail-setDomain.json')
    )

    const response = await client.post('/v1/install/setDomain').json({
      id: 'recorder3',
      domain: 'domain.com',
    })
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'certificates.cert-manager.io "recorder3" already exists',
    })
  })

  test('SetDomain.ingress.failed', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
    nock.load(
      path.join(
        __dirname,
        '..',
        '',
        'helpers/kub8Response/certificate/get-certificate-setDomain.json'
      )
    )

    nock.load(
      path.join(
        __dirname,
        '..',
        '',
        'helpers/kub8Response/certificate/create-success-setDomain.json'
      )
    )
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/ingress/create-fail-setDomain.json')
    )

    const response = await client.post('/v1/install/setDomain').json({
      id: 'recorder3',
      domain: 'domain.com',
    })
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'ingresses.networking.k8s.io "recorder3" already exists',
    })
  })
})
