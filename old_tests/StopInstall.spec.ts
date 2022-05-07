import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Stop Install Test', () => {
  test('Test invalid domain passed', async ({client}) => {
    // Array contains the validation number of validation errors returned and response status

    const response = await client.get
      .post('/v1/install/iab$/stop')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.status, 404)
  })

  test('Install return successful message', async ({client}) => {
    const response = await client.get
      .post('/v1/install/iab/stop')
      .set('Accept', 'application/json')
      .send()

    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
