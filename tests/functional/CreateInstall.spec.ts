import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'
import Env from '@ioc:Adonis/Core/Env'

test.group('Create Install', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
  })
  test('Create.validation')
    .with([
      {
        payload: {},
        errors: 8,
        responseCode: 422,
      },
      {
        payload: { env_type: 'test' },
        errors: 8,
        responseCode: 422,
      },
      {
        payload: { env_type: 'prd' },
        errors: 7,
        responseCode: 422,
      },
      {
        payload: { size: { cpu: 999, memory: '1Mi' } },
        errors: 8,
        responseCode: 422,
      },
      {
        payload: { size: { cpu: 1, memory: '1Gi' } },
        errors: 7,
        responseCode: 422,
      },
      {
        payload: {
          adminFirstName: 'First Name',
          adminLastName: 'Last Name',
          adminEmail: 'email@domain.com',
          adminPassword: 'SomePassword',
          dbPassword: 'Some password',
        },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: {
          id: 'iab',
          env_type: 'dev',
          adminFirstName: 'First Name',
          adminLastName: 'Last Name',
          adminEmail: 'email@domain.com',
          adminPassword: 'SomePassword',
          dbPassword: 'Some password',
          size: 'custom',
        },
        errors: 1,
        responseCode: 422,
      },
    ])
    .run(async ({ client, assert }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eks/eksDesc-success.json'))

      const response = await client.post('/v1/install/create').json(content.payload)
      response.assertStatus(content.responseCode)

      assert.equal(response.body().errors.length, content.errors)
    })

  test('create-install.success')
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
      /*
      Dry Run Response
      */
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
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/ingress/create-dryrun-success.json')
      )

      /*
      Actual Response
      */
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service/create-success.json'))
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/certificate/create-success.json')
      )
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress/create-success.json'))

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(201)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Install create request accepted',
      })
    })

  test('create-install-database.fail')
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
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com')
        .post(/api.*/)
        .times(9)
        .reply(200, {})

      const oldDbHost = Env.get('DB_HOST')
      Env.set('DB_HOST', 'fakehost')
      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
      })
      Env.set('DB_HOST', oldDbHost)
    })

  test('create.fail-statefulset')
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
            'helpers/kub8Response/statefulset/create-dryrun-fail-ci.json'
          )
        )
      } else {
        nock.load(
          path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset/create-dryrun-fail.json')
        )
      }

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'statefulsets.apps "recorder3" already exists',
      })
    })

  test('create-install.fail-service')
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
      /*
      Dry Run Response
      */
      if (process.env.CI) {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success-ci.json'
          )
        )
  
      }else{
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success.json'
          )
        )
      }
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/service/create-dryrun-fail.json')
      )

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'services "recorder3" already exists',
      })
    })

  test('create.fail-certificate')
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
      /*
      Dry Run Response
      */
      if (process.env.CI) {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success-ci.json'
          )
        )
  
      }else{
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success.json'
          )
        )
      }
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/service/create-dryrun-success.json')
      )
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/certificate/create-dryrun-fail.json')
      )

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'certificates.cert-manager.io "recorder3" already exists',
      })
    })

  test('create.fail-ingress')
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
      /*
      Dry Run Response
      */
      if (process.env.CI) {
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success-ci.json'
          )
        )
  
      }else{
        nock.load(
          path.join(
            __dirname,
            '..',
            '',
            'helpers/kub8Response/statefulset/create-dryrun-success.json'
          )
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
      nock.load(
        path.join(__dirname, '..', '', 'helpers/kub8Response/ingress/create-dryrun-fail.json')
      )

      const response = await client.post('/v1/install/create').json(content)
      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'ingresses.networking.k8s.io "recorder3" already exists',
      })
    })
})
