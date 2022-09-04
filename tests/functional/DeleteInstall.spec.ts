import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'
test.group('Delete', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
  })
  
  test('Delete.validation', async ({ client }) => {
    const response = await client.delete('/v1/install/recorder3$$#/delete')
    response.assertStatus(404)
  })

  test('Delete.success', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-delete-success.json'))

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  })

  test('Delete.failed-stateful', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-fail.json'))

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'statefulsets.apps "recorder3" not found',
    })
  })

  test('Delete.failed.service', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-fail.json'))

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'services "recorder3" not found',
    })
  })

  test('Delete.failed.certificate', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-delete-success.json'))
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-delete-fail.json'))

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'certificates.cert-manager.io "recorder3" not found',
    })
  })

  test('Delete.failed.ingress', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-delete-success.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-delete-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-delete-fail.json'))

    const response = await client.delete('/v1/install/delete/recorder3')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'ingresses.networking.k8s.io "recorder3" not found',
    })
  })


})
