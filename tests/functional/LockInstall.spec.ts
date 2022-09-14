import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'

test.group('Lock Install', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })

  test('lock-install.success')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/create-secret-success.json'))
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/patch-secret-success.json'))
      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(201)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Lock request accepted',
      })
    })

  test('lock-install.fail-create-secret')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/create-secret-fail.json'))
      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'secrets "recorder3" already exists',
      })
    })

  test('lock-install.fail-patch-secret')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/create-secret-success.json'))
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/patch-secret-fail.json'))
      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'secrets "recorder3" already exists',
      })
    })
})
