import nock from 'nock'

export function mockCreateKubApiSuccess() {
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

export function mockCreateKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithError('Kub8 Error')
    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithError('Kub8 Error')
    .post('/api/v1/namespaces/default/services')
    .replyWithError('Kub8 Error')
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError('Kub8 Error')
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError('Kub8 Error')
}

export function mockDeleteKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .delete('/api/v1/namespaces/default/services/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
}

export function mockDeleteKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithError('Kub8 Error')
    .delete('/api/v1/namespaces/default/services/iab')
    .replyWithError('Kub8 Error')
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .replyWithError('Kub8 Error')
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .replyWithError('Kub8 Error')
}

export function mockSetDomainKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .reply(201, (_, requestBody) => {
      return {}
    })
}

export function mockSetDomainKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError('Kub8 Error')
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError('Kub8 Error')
}
