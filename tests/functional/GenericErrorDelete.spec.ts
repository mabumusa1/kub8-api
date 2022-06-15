import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import Env from '@ioc:Adonis/Core/Env'

test.group('Generic Error Delete', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })
  test('Delete.failed-stateful-generic', async ({ client }) => {
    nock(Env.get('K8S_API_URL'))
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
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock(Env.get('K8S_API_URL'))
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
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-delete-success.json'))
    nock(Env.get('K8S_API_URL'))
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
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock(Env.get('K8S_API_URL'))
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
