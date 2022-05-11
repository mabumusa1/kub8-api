import { test } from '@japa/runner'
import {
  mockDeleteKubApi,
  mockDeleteKubApiFailed,
  mockDeleteKubApiServiceFailed,
  mockDeleteKubApiIngressFailed,
  mockDeleteKubApiCertificateFailed,
} from '../test_helpers/mock'
import nock from 'nock'
test.group('Delete', (group) => {
  group.each.setup(() => {
    nock.cleanAll()
  })

  group.each.teardown(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  test('Delete.validation', async ({ client }) => {
    const response = await client.delete('/v1/install/iab$$#/delete')
    response.assertStatus(404)
  })

  test('Delete.success', async ({ client }) => {
    mockDeleteKubApi()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  })

  test('Delete.failed', async ({ client }) => {
    mockDeleteKubApiFailed()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Stateful Kub8 Error',
    })
  })

  test('Delete.failed', async ({ client }) => {
    mockDeleteKubApiFailed()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Stateful Kub8 Error',
    })
  })

  test('Delete.failed.service', async ({ client }) => {
    mockDeleteKubApiServiceFailed()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Service Kub8 Error',
    })
  })

  test('Delete.failed.ingress', async ({ client }) => {
    mockDeleteKubApiIngressFailed()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Ingress Kub8 Error',
    })
  })

  test('Delete.failed.certificate', async ({ client }) => {
    mockDeleteKubApiCertificateFailed()
    const response = await client.delete('/v1/install/delete/iab')
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'deleteInstall: Error Deleting Certificate Kub8 Error',
    })
  })
})
