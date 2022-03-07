import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Set Domain Test', () => {
  test('Install return not found from wrong id', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/$iab/setdomain')
      .set('Accept', 'application/json')
      .send()
    assert.equal(response.status, 404)
  })

  test('Install invalid domain', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/setdomain')
      .set('Accept', 'application/json')
      .send({
        domain: 'domain',
      })
    assert.equal(response.status, 422)
  })

  test('Install return successful message', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/setdomain')
      .set('Accept', 'application/json')
      .send({
        domain: 'domain.com',
      })

    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
