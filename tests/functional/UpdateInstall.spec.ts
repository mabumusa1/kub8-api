import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Update Install Test', () => {
  test('Test validation rules', async (assert) => {
    // Array contains the validation number of validation errors returned and response status
    const payloads = [
      [{}, 1, 422],
      [{ size: '5' }, 1, 422],
      [{ size: 'custom' }, 1, 422],
    ]
    for (let index = 0; index < payloads.length; index++) {
      const response = await request(BASE_URL)
        .put('/v1/install/iab')
        .set('Accept', 'application/json')
        .send(payloads[index][0] as object)
      assert.equal(response.body.errors.length, payloads[index][1])
      assert.equal(response.status, payloads[index][2])
    }
  })

  test('Custom install size is neglected if size is defined', async (assert) => {
    const response = await request(BASE_URL)
      .put('/v1/install/iab')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
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
      .put('/v1/install/iab')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
        size: 'custom',
      })
    assert.equal(response.status, 422)
  })

  test('Custom install size must be successful', async (assert) => {
    const response = await request(BASE_URL)
      .put('/v1/install/iab')
      .set('Accept', 'application/json')
      .send({
        id: 'test',
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
      .put('/v1/install/iab')
      .set('Accept', 'application/json')
      .send({
        size: 's1',
      })

    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
