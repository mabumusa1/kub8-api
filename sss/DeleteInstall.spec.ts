import test from 'japa'
import request from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Delete Install Test', () => {
  test('Test validation rules', async ({client}) => {
    const response = await client.get
      .delete('/v1/install/iab$')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.status, 404)
  })

  test('Delete Install return successful message', async ({client}) => {
    const response = await client.get
      .delete('/v1/install/iab')
      .set('Accept', 'application/json')
      .send({})
    assert.equal(response.body.status, 'success')
    assert.equal(response.status, 201)
  })
})
