import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Delete Install Test', () => {
  test('Test validation rules', async (assert) => {
    const response = await request(BASE_URL)
      .delete('/v1/install/iab$')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.status, 404)
  })

  test('Delete Install return successful message', async (assert) => {
    const response = await request(BASE_URL)
      .delete('/v1/install/iab')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
