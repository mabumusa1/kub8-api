import { test } from '@japa/runner'
import nock from 'nock'
import path from 'path'

test.group('Lock Install', (group) => {
  group.each.setup(async () => {
    nock.cleanAll()
  })

  test('lock-install.success')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com:443')
        .post('/api/v1/namespaces/default/secrets')
        .reply(201, {
          kind: 'Secret',
          apiVersion: 'v1',
          metadata: {
            name: 'recorder3',
            namespace: 'default',
            uid: 'aedd6a66-3a99-4f49-aa35-9e1eeebd036b',
            resourceVersion: '15048095',
            creationTimestamp: '2022-09-09T06:53:27Z',
            managedFields: [
              {
                manager: 'unknown',
                operation: 'Update',
                apiVersion: 'v1',
                time: '2022-09-09T06:53:27Z',
                fieldsType: 'FieldsV1',
                fieldsV1: { 'f:data': { '.': {}, 'f:auth': {} }, 'f:type': {} },
              },
            ],
          },
          data: {
            auth: 'c2NfdXNlcjokMmEkMDUkeVlsQVhzL214YTV4QXZFMmF4V0dSZWJIWXY0TVcueFhxdVlpR21UcHRNeXZuQzZ6RG9KUEM=',
          },
          type: 'Opaque',
        })

      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com:443')
        .patch('/apis/networking.k8s.io/v1/namespaces/default/ingresses/recorder3')
        .reply(200, {
          kind: 'Ingress',
          apiVersion: 'networking.k8s.io/v1',
          metadata: {
            name: 'recorder3',
            namespace: 'default',
            uid: '4ce66e31-416e-4af9-804c-c87ba9e5b860',
            resourceVersion: '15052860',
            generation: 1,
            creationTimestamp: '2022-09-06T08:00:30Z',
            annotations: {
              'cert-manager.io/cluster-issuer': 'letsencrypt-prod-ingress',
              'nginx.ingress.kubernetes.io/auth-realm': 'Enter your credentials',
              'nginx.ingress.kubernetes.io/auth-secret': 'recorder3',
              'nginx.ingress.kubernetes.io/auth-secret-type': 'auth-map',
              'nginx.ingress.kubernetes.io/auth-type': 'basic',
            },
            managedFields: [
              {
                manager: 'nginx-ingress-controller',
                operation: 'Update',
                apiVersion: 'networking.k8s.io/v1',
                time: '2022-09-06T08:00:45Z',
                fieldsType: 'FieldsV1',
                fieldsV1: {
                  'f:status': {
                    'f:loadBalancer': {
                      'f:ingress': {},
                    },
                  },
                },
              },
              {
                manager: 'unknown',
                operation: 'Update',
                apiVersion: 'networking.k8s.io/v1',
                time: '2022-09-09T07:18:55Z',
                fieldsType: 'FieldsV1',
                fieldsV1: {
                  'f:metadata': {
                    'f:annotations': {
                      '.': {},
                      'f:cert-manager.io/cluster-issuer': {},
                      'f:nginx.ingress.kubernetes.io/auth-realm': {},
                      'f:nginx.ingress.kubernetes.io/auth-secret': {},
                      'f:nginx.ingress.kubernetes.io/auth-secret-type': {},
                      'f:nginx.ingress.kubernetes.io/auth-type': {},
                    },
                  },
                  'f:spec': {
                    'f:ingressClassName': {},
                    'f:rules': {},
                    'f:tls': {},
                  },
                },
              },
            ],
          },
          spec: {
            ingressClassName: 'nginx',
            tls: [
              {
                hosts: ['recorder3.steercampaign.net'],
                secretName: 'recorder3',
              },
            ],
            rules: [
              {
                host: 'recorder3.steercampaign.net',
                http: {
                  paths: [
                    {
                      path: '/',
                      pathType: 'ImplementationSpecific',
                      backend: {
                        service: {
                          name: 'recorder3',
                          port: {
                            number: 80,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          status: {
            loadBalancer: {
              ingress: [
                {
                  hostname:
                    'ace14f4ced50c4c0c9c0266bd7d70b88-923074304.ap-south-1.elb.amazonaws.com',
                },
              ],
            },
          },
        })

      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(201)
      //TODO:  Add Schema to this aciton
      //response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'success',
        message: 'Lock request accepted',
      })
    })

  test('lock-install.fail-create-secret')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com:443')
        .post('/api/v1/namespaces/default/secrets')
        .reply(409, {
          kind: 'Status',
          apiVersion: 'v1',
          metadata: {},
          status: 'Failure',
          message: 'secrets "recorder3" already exists',
          reason: 'AlreadyExists',
          details: { name: 'recorder3', kind: 'secrets' },
          code: 409,
        })
      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(412)
      //TODO:  Add Schema to this aciton
      //response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'secrets "recorder3" already exists',
      })
    })

  test('lock-install.fail-patch-secret')
    .with([
      {
        id: 'recorder3',
        password: 'password',
      },
    ])
    .run(async ({ client }, content) => {
      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com:443')
        .post('/api/v1/namespaces/default/secrets')
        .reply(200)

      nock('https://0c839694b0426bf3afe0aceae6c821ef.yl4.ap-south-1.eks.amazonaws.com:443')
        .patch('/apis/networking.k8s.io/v1/namespaces/default/ingresses/recorder3')
        .reply(409, {
          kind: 'Status',
          apiVersion: 'v1',
          metadata: {},
          status: 'Failure',
          message: 'secrets "recorder3" already exists',
          reason: 'AlreadyExists',
          details: { name: 'recorder3', kind: 'secrets' },
          code: 409,
        })
      const response = await client.post('/v1/install/lock').json(content)
      response.assertStatus(412)
      //TODO:  Add Schema to this aciton
      //response.assertAgainstApiSpec()
      response.assertBodyContains({
        status: 'error',
        message: 'secrets "recorder3" already exists',
      })
    })
})
