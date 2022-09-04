import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import Env from '@ioc:Adonis/Core/Env'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'

test.group('Generic Error Delete', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
  })
  test('Delete.failed-stateful-generic', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
      .delete('/apis/apps/v1/namespaces/default/statefulsets/recorder3')
      .replyWithError('something awful happened')

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'something awful happened',
    })
  })

  test('Delete.failed.service-generic', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
      .delete('/api/v1/namespaces/default/services/recorder3')
      .replyWithError('something awful happened')

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'something awful happened',
    })
  })

  test('Delete.failed.certificate-generic', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-delete-success.json'))
    nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
      .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/recorder3')
      .replyWithError('something awful happened')

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'something awful happened',
    })
  })

  test('Delete.failed.ingress-generic', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
      .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/recorder3')
      .replyWithError('something awful happened')

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'something awful happened',
    })
  })
})
