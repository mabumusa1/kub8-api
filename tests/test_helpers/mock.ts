import { HttpError } from '@kubernetes/client-node'
import nock from 'nock'
var fs = require('fs')
let jsonError = fs.readFileSync(__dirname + '/Kub8Responses/error.json', 'utf8')
import * as http from 'http'

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
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(404, {})
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(404, {})

    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithFile(201, __dirname + '/Kub8Responses/postStatefulsets.json', {
      'Content-Type': 'application/json',
    })
    .post('/api/v1/namespaces/default/services')
    .replyWithFile(201, __dirname + '/Kub8Responses/postServices.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithFile(201, __dirname + '/Kub8Responses/postCertificates.json', {
      'Content-Type': 'application/json',
    })

    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithFile(201, __dirname + '/Kub8Responses/postIngresses.json', {
      'Content-Type': 'application/json',
    })
}

export function mockCreateKubServiceError() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(404, {})
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(404, {})

    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithFile(201, __dirname + '/Kub8Responses/postStatefulsets.json', {
      'Content-Type': 'application/json',
    })
    .post('/api/v1/namespaces/default/services')
    .replyWithError(jsonError)
}

export function mockCreateKubApiIngressError() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(404, {})
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(404, {})

    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithFile(201, __dirname + '/Kub8Responses/postStatefulsets.json', {
      'Content-Type': 'application/json',
    })
    .post('/api/v1/namespaces/default/services')
    .replyWithFile(201, __dirname + '/Kub8Responses/postServices.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithFile(201, __dirname + '/Kub8Responses/postCertificates.json', {
      'Content-Type': 'application/json',
    })

    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError(jsonError)
}

export function mockCreateKubApiCertificateError() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(404, {})

    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(404, {})

    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithFile(201, __dirname + '/Kub8Responses/postStatefulsets.json', {
      'Content-Type': 'application/json',
    })
    .post('/api/v1/namespaces/default/services')
    .replyWithFile(201, __dirname + '/Kub8Responses/postServices.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError(jsonError)
}

/**
 * Fails mean the Kub8 server can not handle the request
 * 1. Stateful return 500
 * @return  {nock}  return the nock object
 */
export function mockCreateKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(404, {})
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(404, {})
    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithError(jsonError)
}

export function mockCreateKubApiCheckFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithError(jsonError)
}

export function mockCreateKubApiCheckStatfulFound() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithFile(201, __dirname + '/Kub8Responses/getStatefulsets.json', {
      'Content-Type': 'application/json',
    })
}

export function mockCreateKubApiCheckServiceFound() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .replyWithFile(201, __dirname + '/Kub8Responses/getServices.json', {
      'Content-Type': 'application/json',
    })
}

export function mockCreateKubApiCheckIngressFound() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .replyWithFile(201, __dirname + '/Kub8Responses/getIngresses.json', {
      'Content-Type': 'application/json',
    })
}

export function mockCreateKubApiCheckCertificateFound() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(404, {})
    .get('/api/v1/namespaces/default/services/iab')
    .reply(404, {})
    .get('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(404, {})
    .get('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .replyWithFile(201, __dirname + '/Kub8Responses/getCertificates.json', {
      'Content-Type': 'application/json',
    })
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
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(201)
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
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
    .replyWithError(jsonError)
    .delete('/api/v1/namespaces/default/services/iab')
    .replyWithError(jsonError)
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .replyWithError(jsonError)
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .replyWithError(jsonError)
}

export function mockDeleteKubApiServiceFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, {})
    .delete('/api/v1/namespaces/default/services/iab')
    .replyWithError(jsonError)
}

export function mockDeleteKubApiIngressFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, {})
    .delete('/api/v1/namespaces/default/services/iab')
    .reply(201, {})
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(201, {})
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .replyWithError(jsonError)
}
export function mockDeleteKubApiCertificateFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, {})
    .delete('/api/v1/namespaces/default/services/iab')
    .reply(201, {})
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .replyWithError(jsonError)
}

export function mockSetDomainKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithFile(201, __dirname + '/Kub8Responses/postCertificates.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithFile(201, __dirname + '/Kub8Responses/postIngresses.json', {
      'Content-Type': 'application/json',
    })
}

export function mockSetDomainKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError(jsonError)
}

export function mockSetDomainKubApiFailedIngress() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithFile(201, __dirname + '/Kub8Responses/postCertificates.json', {
      'Content-Type': 'application/json',
    })
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError(new HttpError(new http.IncomingMessage(), jsonError))
}
