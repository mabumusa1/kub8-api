import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import Env from '@ioc:Adonis/Core/Env'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'

test.group('Generic Error Create', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
  })

  test('create.fail-statefulset-generic')
    .with([
      {
        id: 'recorder3',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/apis/apps/v1/namespaces/default/statefulsets')
        .replyWithError('something awful happened')
      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        // message: 'something awful happened',
      })
    })

  test('create.fail-service-generic')
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
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/api/v1/namespaces/default/services')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        // message: 'something awful happened',
      })
    })

  test('create.fail-certificate-generic')
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

      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        //   message: 'something awful happened',
      })
    })

  test('create.fail-ingress-generic')
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
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        //  message: 'something awful happened',
      })
    })
})
