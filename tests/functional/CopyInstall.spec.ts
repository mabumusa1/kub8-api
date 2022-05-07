import { test } from '@japa/runner'


test.group('Copy', () => {
  test('Copy.validation', async ({client, assert}, content) => {
    const response = await client.post('/v1/install/iab/copy').json(content.payload)
    response.assertStatus(content.responseCode)
    assert.equal(response.body().errors.length, content.errors)
  }).with([
    {
      payload: {},
      errors: 3, 
      responseCode: 422
    },
    {
      payload: {env_type: 'test'},
      errors: 3, 
      responseCode: 422
    },
    {
      payload: { env_type: 'stg' },
      errors: 2, 
      responseCode: 422
    },
    {
      payload: { size: '5' },
      errors: 3, 
      responseCode: 422
    },
    {
      payload: { size: 's5' },
      errors: 2, 
      responseCode: 422
    },    
    {
      payload: { domain: 'domain.com' },
      errors: 2, 
      responseCode: 422
    },    
    {
      payload: { domain: 'domain' },
      errors: 3, 
      responseCode: 422
    },    
    {
      payload: { domain: 'some-region' },
      errors: 3, 
      responseCode: 422
    },      
  ])

  
  test('Copy.custom size ignore if size defined', async ({client}) => {
    const response = await client.post('/v1/install/iab/copy').json({
      env_type: 'dev',
      domain: 'domain.com',
      size: 's1',
      custom: {
        cpu: '1',
        memory: '12',
      },
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install copy request accepted',
    })
  })

  test('Copy.custom install size is defined the custom object must be exist', async ({client, assert}) => {

    const response = await client.post('/v1/install/iab/copy').json({
      env_type: 'dev',
      domain: 'domain.com',
      size: 'custom',
    })
    response.assertStatus(422)
    assert.equal(response.body().errors.length, 1)    
  })  

  test('Copy.success', async ({client}) => {
    const response = await client.post('/v1/install/iab/copy').json({
      env_type: 'stg',
      'size': 's1',
      'domain': 'domain.com',
    })
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install copy request accepted',
    })
  })
})
