import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'
test.group('Copy', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
    DatabaseTestHelper.clearDatabase()
  })

  test('Copy.validation')
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

  test('Copy.custom size ignore if size defined', async ({ client }) => {
    const response = await client.post('/v1/install/copy').json({
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
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install copy request accepted',
    })
  })

  test('Copy.success', async ({ client }) => {
    const response = await client.post('/v1/install/copy').json({
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
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install copy request accepted',
    })
  })
})
