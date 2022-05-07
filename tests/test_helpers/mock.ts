import nock from 'nock'

export function mockKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/api/v1/namespaces/default/services')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .reply(201, (_, requestBody) => {
      return {}
    })
}
