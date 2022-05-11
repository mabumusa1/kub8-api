import nock from 'nock'

/**
 * Successful create means, there is:
 * 1. Stateful return 404
 * 2. Service return 404
 * 3. Ingress return 404
 * 4. Certificate return 404
 * 5. Stateful return 200
 * 6. Service return 200
 * 7. Ingress return 200
 * 8. Certificate return 200
 *
 * @return  {nock}  return the nock object
 */
export function mockCreateKubApiSuccess() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithFile(404, __dirname + '/Kub8Responses/getStatefulsets.json', {
      'Content-Type': 'application/json',
    })
    .get('/api/v1/namespaces/default/services/iab')
    .replyWithFile(404, __dirname + '/Kub8Responses/getServices.json', {
      'Content-Type': 'application/json',
    })
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .replyWithFile(404, __dirname + '/Kub8Responses/getIngresses.json', {
      'Content-Type': 'application/json',
    })
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .replyWithFile(404, __dirname + '/Kub8Responses/getCertificates.json', {
      'Content-Type': 'application/json',
    })

    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithFile(201, __dirname + '/Kub8Responses/postStatefulsets.json', {
      'Content-Type': 'application/json',
    })
    .post('/api/v1/namespaces/default/services')
    .replyWithFile(201, __dirname + '/Kub8Responses/postServices.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithFile(201, __dirname + '/Kub8Responses/postIngresses.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithFile(201, __dirname + '/Kub8Responses/postCertificates.json', {
      'Content-Type': 'application/json',
    })
}

/**
 * Fails mean the Kub8 server can not handle the request
 * 1. Stateful return 500
 * @return  {nock}  return the nock object
 */
export function mockCreateKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithError('Kub8 Error')
}

/**
 * Successful create means, there is:
 * 1. Stateful return 201
 * 2. Service return 201
 * 3. Ingress return 201
 * 4. Certificate return 201
 * @return  {nock}  return the nock object
 */
export function mockDeleteKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201)
    .delete('/api/v1/namespaces/default/services/iab')
    .reply(201)
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(201)
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(201)
}

/**
 * Fails mean the Kub8 server can not handle the request
 * 1. Stateful return 500
 * @return  {nock}  return the nock object
 */
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
    .replyWithFile(201, __dirname + '/Kub8Responses/postIngresses.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithFile(201, __dirname + '/Kub8Responses/postCertificates.json', {
      'Content-Type': 'application/json',
    })
}

export function mockSetDomainKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError('Kub8 Error')
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError('Kub8 Error')
}
