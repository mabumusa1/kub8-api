import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create Install Test', () => {
  test('Test validation rules', async (assert) => {
    // Array contains the validation number of validation errors returned and response status
    const payloads = [
      [{}, 4, 422],
      [{ id: '...test' }, 4, 422],
      [{ id: '1212test' }, 3, 422],
      [{ env_type: 'test' }, 4, 422],
      [{ env_type: 'stg' }, 3, 422],
      [{ size: '5' }, 4, 422],
      [{ size: 's5' }, 3, 422],
      [{ domain: 'domain.com' }, 3, 422],
      //[{ domain: 'domain' }, 4, 422],
      //[{ region: 'some-region' }, 4, 422],
    ]
    for (let index = 0; index < payloads.length; index++) {
      const response = await request(BASE_URL)
        .post('/v1/install')
        .set('Accept', 'application/json')
        .send(payloads[index][0])
        console.log(response.body.errors)
      assert.equal(response.body.errors.length, payloads[index][1])
      assert.equal(response.status, payloads[index][2])
    }
  })
})
