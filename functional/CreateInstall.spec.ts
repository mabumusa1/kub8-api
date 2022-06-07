import { test } from '@japa/runner'
test.group('Create', (group) => {
  test('Create.validation')
    .with([
      {
        payload: {},
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { env_type: 'test' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { env_type: 'stg' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: { size: '5' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { size: 's5' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: { domain: 'domain.com' },
        errors: 3,
        responseCode: 422,
      },
      {
        payload: { domain: 'domain' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: { domain: 'some-region' },
        errors: 4,
        responseCode: 422,
      },
      {
        payload: {
          id: 'iab',
          env_type: 'dev',
          domain: 'domain.com',
          size: 'custom',
        },
        errors: 1,
        responseCode: 422,
      },
    ])
    .run(async ({ client, assert }, content) => {
      const response = await client.post('/v1/install/create').json(content.payload)
      response.assertStatus(content.responseCode)
      assert.equal(response.body().errors.length, content.errors)
    })

  test('create.success')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
      {
        id: 'iab',
        env_type: 'dev',
        domain: 'domain.com',
        size: 's1',
        custom: {
          cpu: '1',
          memory: '12',
        },
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(201)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Install create request accepted',
      })
      // TODO: Assert custom size is created
    })

  test('create.failed.statful')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'createInstall: Error Creating Stateful Kub8 Error',
      })
    })

  test('create.failed.service')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'createInstall: Error Creating Service Kub8 Error',
      })
    })

  test('create.failed.ingress')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'createInstall: Error Creating Ingress Kub8 Error',
      })
    })
  test('create.failed.certificate')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'createInstall: Error Creating Certificate Kub8 Error',
      })
    })

  test('create.check.failed')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'canCreateInstall: Error Checking Stateful Kub8 Error',
      })
    })

  test('create.check.stateful.found')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'canCreateInstall: Error Checking Stateful Statefulset already exists',
      })
    })

  test('create.check.service.found')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'canCreateInstall: Error Checking Service Service already exists',
      })
    })

  test('create.check.ingress.found')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'canCreateInstall: Error Checking Ingress Ingress already exists',
      })
    })

  test('create.check.certificate.found')
    .with([
      {
        id: 'iab',
        env_type: 'stg',
        size: 's1',
        domain: 'domain.com',
      },
    ])
    .run(async ({ client }, content) => {
      const response = await client.post('/v1/install/create').json(content)

      response.assertStatus(412)
      response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'canCreateInstall: Error Checking Certificate Certificate already exists',
      })
    })
})
