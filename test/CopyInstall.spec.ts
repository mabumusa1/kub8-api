import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Copy Install Test', () => {
  test('Test invalid domain passed', async (assert) => {
    // Array contains the validation number of validation errors returned and response status

    const response = await request(BASE_URL)
      .post('/v1/install/iab$/copy')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.status, 404)
  })

  test('Test validation rules', async (assert) => {
    // Array contains the validation number of validation errors returned and response status
    const payloads = [
      [{}, 4, 422],
      [{ env_type: 'test' }, 4, 422],
      [{ env_type: 'stg' }, 3, 422],
      [{ size: '5' }, 4, 422],
      [{ size: 's5' }, 3, 422],
      [{ domain: 'domain.com' }, 3, 422],
      [{ domain: 'domain' }, 4, 422],
      [{ region: 'some-region' }, 4, 422],
    ]
    for (let index = 0; index < payloads.length; index++) {
      const response = await request(BASE_URL)
        .post('/v1/install/iab/copy')
        .set('Accept', 'application/json')
        .send(payloads[index][0])
      assert.equal(response.body.errors.length, payloads[index][1])
      assert.equal(response.status, payloads[index][2])
    }
  })

  test('Custom install size is neglected if size is defined', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/copy')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
        env_type: 'dev',
        domain: 'domain.com',
        size: 's1',
        custom: {
          cpu: '1',
          memory: '12',
        },
      })
    assert.equal(response.status, 201)
  })

  test('Custom install size is defined the custom object must be exist', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/copy')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
        env_type: 'dev',
        domain: 'domain.com',
        size: 'custom',
      })
    assert.equal(response.status, 422)
  })

  test('Custom install size must be successful', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/copy')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
        env_type: 'dev',
        domain: 'domain.com',
        size: 'custom',
        custom: {
          cpu: 1,
          memory: 2,
        },
      })
    assert.equal(response.status, 201)
  })

  test('Install return successful message', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/copy')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
        env_type: 'dev',
        domain: 'domain.com',
        size: 's1',
      })

    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
