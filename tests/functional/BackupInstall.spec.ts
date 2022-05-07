import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Stop Install Test', () => {
  test('Test invalid domain passed', async (assert) => {
    // Array contains the validation number of validation errors returned and response status

    const response = await request(BASE_URL)
      .post('/v1/install/iab$/backup')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.status, 404)
  })

  test('Test source parameters', async (assert) => {
    const payloads = [
      ['automated', 201],
      ['user', 201],
      ['wrong', 404],
    ]
    for (let i = 0; i < payloads.length; i++) {
      const response = await request(BASE_URL)
        .post(`/v1/install/iab/backup/${payloads[i][0]}`)
        .set('Accept', 'application/json')
        .send()
      assert.equal(response.status, payloads[i][1])
    }
  })

  test('Install return successful message', async (assert) => {
    const response = await request(BASE_URL)
      .post('/v1/install/iab/backup/user')
      .set('Accept', 'application/json')
      .send()

    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
