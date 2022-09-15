import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
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
        env_type: 'dev',
        adminFirstName: 'first',
        adminLastName: 'last',
        adminEmail: 'admin@domain.com',
        adminPassword: 'password',
        dbPassword: 'password',
        size: {
          memory: '1Gi',
          cpu: '1',
        },
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/apis/apps/v1/namespaces/default/statefulsets?dryRun=All')
        .replyWithError('something awful happened')
      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
      })
    })

  test('create.fail-service-generic')
    .with([
      {
        id: 'recorder3',
        env_type: 'dev',
        adminFirstName: 'first',
        adminLastName: 'last',
        adminEmail: 'admin@domain.com',
        adminPassword: 'password',
        dbPassword: 'password',
        size: {
          memory: '1Gi',
          cpu: '1',
        },
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      if (process.env.CI) {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success-ci.json'
          )
        )
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-success-ci.json')
        )
      } else {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success.json'
          )
        )
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-success.json')
        )
      }

      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/api/v1/namespaces/default/services?dryRun=All')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
      })
    })

  test('create.fail-certificate-generic')
    .with([
      {
        id: 'recorder3',
        env_type: 'dev',
        adminFirstName: 'first',
        adminLastName: 'last',
        adminEmail: 'admin@domain.com',
        adminPassword: 'password',
        dbPassword: 'password',
        size: {
          memory: '1Gi',
          cpu: '1',
        },
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      if (process.env.CI) {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success-ci.json'
          )
        )
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-success-ci.json')
        )
      } else {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success.json'
          )
        )
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-success.json')
        )
      }
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/service/create-dryrun-success.json')
      )

      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/apis/cert-manager.io/v1/namespaces/default/certificates?dryRun=All')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
      })
    })

  test('create.fail-ingress-generic')
    .with([
      {
        id: 'recorder3',
        env_type: 'dev',
        adminFirstName: 'first',
        adminLastName: 'last',
        adminEmail: 'admin@domain.com',
        adminPassword: 'password',
        dbPassword: 'password',
        size: {
          memory: '1Gi',
          cpu: '1',
        },
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      if (process.env.CI) {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success-ci.json'
          )
        )
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-success-ci.json')
        )
      } else {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success.json'
          )
        )
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-success.json')
        )
      }
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/service/create-dryrun-success.json')
      )
      nock.load(
        path.join(
          __dirname,
          '..',
          '',
          'helpers/kub8Response/certificate/create-dryrun-success.json'
        )
      )
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses?dryRun=All')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
      })
    })

  test('create-secret.fail-lock')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post('/api/v1/namespaces/default/secrets')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
      })
    })

  test('patch-secret.fail-lock')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/secrets/create-secret-success.json')
      )
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .patch('/apis/networking.k8s.io/v1/namespaces/default/ingresses/recorder3')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
      })
    })

  test('delete-secret.fail-unlock')
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
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .delete('/api/v1/namespaces/default/secrets/lock-recorder3')
        .replyWithError('something awful happened')

      const response = await client.post('/v1/install/unLock').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'something awful happened',
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
    nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
      .patch('/apis/networking.k8s.io/v1/namespaces/default/ingresses/recorder3')
      .replyWithError('something awful happened')

    const response = await client.post('/v1/install/setDomain').json({
      id: 'recorder3',
      domain: 'domain.com',
    })
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'something awful happened',
    })
  })

  test('SetDomain.certificate.failed', async ({ client }) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))
    nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
      .get('/apis/cert-manager.io/v1/namespaces/default/certificates/recorder3')
      .replyWithError('something awful happened')

    const response = await client.post('/v1/install/setDomain').json({
      id: 'recorder3',
      domain: 'domain.com',
    })
    response.assertStatus(412)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'error',
      message: 'something awful happened',
    })
  })
})
