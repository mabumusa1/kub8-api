import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'

test.group('Create Install', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
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
      console.log(response.status, response.body())
      response.assertStatus(content.responseCode)

      assert.equal(response.body().errors.length, content.errors)
    })

  test('create-install.success')
    .with([
      {
        id: 'recorder' + Date.now(),
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
      {
        id: 'recorder3' + Date.now(),
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
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-success.json'))
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-create-success.json'))

      console.log(__dirname + '/../' + 'helpers/kub8Response/statefulset-create-success.json')
      const scopeStatefulSet = nock("https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com")
      .post('/apis/apps/v1/namespaces/default/statefulsets')
      .replyWithFile(201, __dirname + '/../' + 'helpers/kub8Response/statefulset-create-success.json', {
        'Content-Type': 'application/json',
      })

      const scopeService = nock("https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com")
      .post("/api/v1/namespaces/default/services")
      .replyWithFile(201, __dirname + '/../' + 'helpers/kub8Response/service-create-success.json', {
        'Content-Type': 'application/json',
      })

      const scopeCertificate = nock("https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com")
      .post("/apis/cert-manager.io/v1/namespaces/default/certificates")
      .replyWithFile(201, __dirname + '/../' + 'helpers/kub8Response/certificate-create-success.json', {
        'Content-Type': 'application/json',
      })

      const scopeIngress = nock("https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com")
      .post("/apis/networking.k8s.io/v1/namespaces/default/ingresses")
      .replyWithFile(201, __dirname + '/../' + 'helpers/kub8Response/ingress-create-success.json', {
        'Content-Type': 'application/json',
      })

      const response = await client.post('/v1/install/create').json(content)
      console.log(response.status(), response.body())
      response.assertStatus(201)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Install create request accepted',
      })
      // TODO: Assert custom size is created
    })

  /*
  test('create.fail-statefulset')
    .with([
      {
        id: 'recorder3',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-fail.json'))

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(422)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'statefulsets.apps "recorder3" already exists',
      })
    })*/

  test('create-install.fail-service')
    .with([
      {
        id: 'recorder3',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-fail.json'))

      const scopeService = nock("https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com")
      .post("/api/v1/namespaces/default/services")
      .replyWithFile(412, __dirname + '/../' + 'helpers/kub8Response/service-create-fail.json', {
        'Content-Type': 'application/json',
      })

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'statefulsets.apps "recorder3" already exists',
      })
    })

  test('create.fail-certificate')
    .with([
      {
        id: 'recorder3',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-success.json'))
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-create-fail.json'))

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'statefulsets.apps "recorder3" already exists',
      })
    })

  test('create.fail-ingress')
    .with([
      {
        id: 'recorder3',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-success.json'))
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-create-fail.json'))
      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'statefulsets.apps "recorder3" already exists',
      })
    })
})
