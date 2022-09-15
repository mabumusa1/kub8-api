import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'

test.group('unLock Install', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })

  test('unlock-install.success')
    .with([
      {
        id: 'recorder3',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock.load(
        path.join(
          __dirname,
          '..',
          '',
          'helpers/kub8Response/secrets/patch-secret-unlock-success.json'
        )
      )
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/delete-secret-success.json')
      )

      const response = await client.post('/v1/install/unLock').json(content)
      response.assertStatus(201)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Unlock request accepted',
      })
    })

  test('unlock-install.success')
    .with([
      {
        id: 'recorder3',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock.load(
        path.join(
          __dirname,
          '..',
          '',
          'helpers/kub8Response/secrets/patch-secret-unlock-success.json'
        )
      )
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/delete-secret-fail.json')
      )

      const response = await client.post('/v1/install/unLock').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'secret "lock-recorder3" not found',
      })
    })
})
