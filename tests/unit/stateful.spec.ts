import { test } from '@japa/runner'
import { KubeConfig } from '@kubernetes/client-node'
import { Statefulset } from '../../providers/K8sClient/Statefulset'
import { loadYamls } from '../../providers/K8sClient/Helpers'
import { K8sConfig } from 'Config/k8s'
import nock from 'nock'
import { assert } from '@japa/preset-adonis'

test.group('Test Stateful', (group) => {
  group.each.setup(() => {
    nock.disableNetConnect()
  })
  group.each.teardown(() => {
    nock.enableNetConnect()
  })

  test('Create Success', async ({ assert }) => {
    const yamls = loadYamls({ CLIENT_NAME: 'recorder3' })
    const kc = new KubeConfig()
    kc.loadFromOptions(K8sConfig)
    const statful = new Statefulset(kc)
    nock('http://localhost:8001', { encodedQueryParams: true })
      .post('/apis/apps/v1/namespaces/default/statefulsets', {
        apiVersion: 'apps/v1',
        kind: 'StatefulSet',
        metadata: { name: 'recorder3' },
        spec: {
          replicas: 1,
          selector: { matchLabels: { app: 'recorder3' } },
          serviceName: 'recorder3',
          template: {
            metadata: { labels: { app: 'recorder3' } },
            spec: {
              containers: [
                {
                  image: 'nginx',
                  name: 'recorder3',
                  ports: [{ containerPort: 80, name: 'recorder3' }],
                },
              ],
              restartPolicy: 'Always',
              terminationGracePeriodSeconds: 10,
            },
          },
        },
      })
      .reply(
        201,
        {
          kind: 'StatefulSet',
          apiVersion: 'apps/v1',
          metadata: {
            name: 'recorder3',
            namespace: 'default',
            uid: 'c54cda6e-fa48-4717-830f-86e07b7ba2f5',
            resourceVersion: '4095252',
            generation: 1,
            creationTimestamp: '2022-06-05T11:01:29Z',
            managedFields: [
              {
                manager: 'kubectl',
                operation: 'Update',
                apiVersion: 'apps/v1',
                time: '2022-06-05T11:01:29Z',
                fieldsType: 'FieldsV1',
                fieldsV1: {
                  'f:spec': {
                    'f:podManagementPolicy': {},
                    'f:replicas': {},
                    'f:revisionHistoryLimit': {},
                    'f:selector': {},
                    'f:serviceName': {},
                    'f:template': {
                      'f:metadata': { 'f:labels': { '.': {}, 'f:app': {} } },
                      'f:spec': {
                        'f:containers': {
                          'k:{"name":"recorder3"}': {
                            '.': {},
                            'f:image': {},
                            'f:imagePullPolicy': {},
                            'f:name': {},
                            'f:ports': {
                              '.': {},
                              'k:{"containerPort":80,"protocol":"TCP"}': {
                                '.': {},
                                'f:containerPort': {},
                                'f:name': {},
                                'f:protocol': {},
                              },
                            },
                            'f:resources': {},
                            'f:terminationMessagePath': {},
                            'f:terminationMessagePolicy': {},
                          },
                        },
                        'f:dnsPolicy': {},
                        'f:restartPolicy': {},
                        'f:schedulerName': {},
                        'f:securityContext': {},
                        'f:terminationGracePeriodSeconds': {},
                      },
                    },
                    'f:updateStrategy': {
                      'f:rollingUpdate': { '.': {}, 'f:partition': {} },
                      'f:type': {},
                    },
                  },
                },
              },
            ],
          },
          spec: {
            replicas: 1,
            selector: { matchLabels: { app: 'recorder3' } },
            template: {
              metadata: { creationTimestamp: null, labels: { app: 'recorder3' } },
              spec: {
                containers: [
                  {
                    name: 'recorder3',
                    image: 'nginx',
                    ports: [{ name: 'recorder3', containerPort: 80, protocol: 'TCP' }],
                    resources: {},
                    terminationMessagePath: '/dev/termination-log',
                    terminationMessagePolicy: 'File',
                    imagePullPolicy: 'Always',
                  },
                ],
                restartPolicy: 'Always',
                terminationGracePeriodSeconds: 10,
                dnsPolicy: 'ClusterFirst',
                securityContext: {},
                schedulerName: 'default-scheduler',
              },
            },
            serviceName: 'recorder3',
            podManagementPolicy: 'OrderedReady',
            updateStrategy: { type: 'RollingUpdate', rollingUpdate: { partition: 0 } },
            revisionHistoryLimit: 10,
          },
          status: { replicas: 0, availableReplicas: 0 },
        },
        [
          'Audit-Id',
          '85e6cc15-c889-47a7-b695-35849edbee63',
          'Cache-Control',
          'no-cache, private',
          'Content-Length',
          '1828',
          'Content-Type',
          'application/json',
          'Date',
          'Sun, 05 Jun 2022 11:01:29 GMT',
          'X-Kubernetes-Pf-Flowschema-Uid',
          'cb9af28d-5208-485f-a6af-d5dbec55ab8c',
          'X-Kubernetes-Pf-Prioritylevel-Uid',
          '4333ee44-c8d9-44da-8b86-e441cd82a78d',
          'Connection',
          'close',
        ]
      )

    assert.isTrue(await statful.createStateful(yamls['01StatefulSet.yml']))
  })
})
