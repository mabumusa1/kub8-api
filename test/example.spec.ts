import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Install Test', () => {
  test('ensure create works', async (assert) => {
    const response = await request(BASE_URL).get('/').set('Accept', 'application/json')
    assert.equal(response.status, 200)
  })
})
