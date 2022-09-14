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
        payload: { size: '5' },
        errors: 8,
        responseCode: 422,
      },
      {
        payload: { size: 's5' },
        errors: 7,
        responseCode: 422,
      },
      {
        payload: { adminFirstName: 'First Name', adminLastName: 'Last Name', adminEmail: 'email@domain.com', adminPassword: 'SomePassword', dbPassword: 'Some password' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: {
          id: 'iab',
          env_type: 'dev',
          adminFirstName: 'First Name', adminLastName: 'Last Name', adminEmail: 'email@domain.com', adminPassword: 'SomePassword', dbPassword: 'Some password',
          size: 'custom',
        },
        errors: 1,
        responseCode: 422,
      },
    ])
    .run(async ({ client, assert }, content) => {
      nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))

      const response = await client.post('/v1/install/create').json(content.payload)
      response.assertStatus(content.responseCode)

      assert.equal(response.body().errors.length, content.errors)
    })

})

test('create-install.success')
.with([
  {
    id: 'recorder3',
    env_type: 'dev',
    adminFirstName: 'First Name', adminLastName: 'Last Name', adminEmail: 'email@domain.com', adminPassword: 'SomePassword', dbPassword: 'SomePassword',
    size: 's1',
  },
  {
    id: 'recorder3',
    env_type: 'prd',
    domain: 'domain.com',
    size: 'custom',
    custom: {
      cpu: '1',
      memory: '12',
    },
  },
])
.run(async ({ client }, content) => {
  nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
  nock.load(
    path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success-dryrun.json')
  )

  nock.load(
    path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
  )
  nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-success.json'))
  nock.load(
    path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-create-success.json')
  )
  nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-create-success.json'))

  const response = await client.post('/v1/install/create').json(content)
  
  response.assertStatus(201)
  response.assertAgainstApiSpec()
  response.assertBodyContains({
    status: 'success',
    message: 'Install create request accepted',
  })
  // TODO: Assert custom size is created
  test('create-install.fail.database')
  .with([
    {
      id: 'recorder3',
      env_type: 'prd',
      size: 's1',
      domain: 'domain.com',
    },
  ])
  .run(async ({ client }, content) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-success.json'))
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/certificate-create-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/ingress-create-success.json'))
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
      env_type: 'prd',
      size: 's1',
      domain: 'domain.com',
    },
  ])
  .run(async ({ client }, content) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
  
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-fail.json'))
  
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
      env_type: 'prd',
      size: 's1',
      domain: 'domain.com',
    },
  ])
  .run(async ({ client }, content) => {
    nock.load(
      path.join(__dirname, '..', '', 'helpers/kub8Response/statefulset-create-success.json')
    )
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/service-create-fail.json'))
  
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
      env_type: 'prd',
      size: 's1',
      domain: 'domain.com',
    },
  ])
  .run(async ({ client }, content) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
  
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
      message: 'certificates.cert-manager.io "recorder3" already exists',
    })
  })
  
  test('create.fail-ingress')
  .with([
    {
      id: 'recorder3',
      env_type: 'prd',
      size: 's1',
      domain: 'domain.com',
    },
  ])
  .run(async ({ client }, content) => {
    nock.load(path.join(__dirname, '..', '', 'helpers/kub8Response/eksDesc.json'))
  
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
      message: 'ingresses.networking.k8s.io "recorder3" already exists',
    })
  })
  
})
