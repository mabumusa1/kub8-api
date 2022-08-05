import { test } from '@japa/runner'
import nock from 'nock'
import { saveTape } from '../helpers/saveTape'
import { KubeConfig } from '@kubernetes/client-node'
import { Statefulset } from '../../app/Services/K8sClient/Statefulset'
import { Service } from '../../app/Services/K8sClient/Service'
import { Ingress } from '../../app/Services/K8sClient/Ingress'
import { Certificate } from '../../app/Services/K8sClient/Certificate'
import { loadYamls } from '../../app/Services/K8sClient/Helpers'
import { K8sConfig } from 'Config/k8s'

/**
 * How to use this test?
 * This test is used to record and save requests to Kub8 Server
 * To run this test, you need to run the following command:
 *
 * node ace test record
 *
 * Make sure that you have tunnel opened to Kub8 Server
 */

test.group('recordResponse', () => {
  test('Record responses')
    .with([
      {
        clientName: 'recorder3',
        type: 'statefulset',
        action: 'create',
        status: 'success',
        statusCode: 201,
      },
      {
        clientName: 'recorder3',
        type: 'statefulset',
        action: 'create',
        status: 'fail',
        statusCode: 409,
      },
      {
        clientName: 'recorder3',
        type: 'statefulset',
        action: 'delete',
        status: 'success',
        statusCode: 200,
      },
      {
        clientName: 'recorder3',
        type: 'statefulset',
        action: 'delete',
        status: 'fail',
        statusCode: 404,
      },
      {
        clientName: 'recorder3',
        type: 'service',
        action: 'create',
        status: 'success',
        statusCode: 201,
      },
      {
        clientName: 'recorder3',
        type: 'service',
        action: 'create',
        status: 'fail',
        statusCode: 409,
      },
      {
        clientName: 'recorder3',
        type: 'service',
        action: 'delete',
        status: 'success',
        statusCode: 200,
      },
      {
        clientName: 'recorder3',
        type: 'service',
        action: 'delete',
        status: 'fail',
        statusCode: 404,
      },
      {
        clientName: 'recorder3',
        type: 'ingress',
        action: 'create',
        status: 'success',
        statusCode: 201,
      },
      {
        clientName: 'recorder3',
        type: 'ingress',
        action: 'create',
        status: 'fail',
        statusCode: 409,
      },
      {
        clientName: 'recorder3',
        type: 'ingress',
        action: 'delete',
        status: 'success',
        statusCode: 200,
      },
      {
        clientName: 'recorder3',
        type: 'ingress',
        action: 'delete',
        status: 'fail',
        statusCode: 404,
      },
      {
        clientName: 'recorder3',
        type: 'certificate',

        action: 'create',
        status: 'success',
        statusCode: 201,
      },
      {
        clientName: 'recorder3',
        type: 'certificate',
        action: 'create',
        status: 'fail',
        statusCode: 409,
      },
      {
        clientName: 'recorder3',
        type: 'certificate',
        action: 'delete',
        status: 'success',
        statusCode: 200,
      },
      {
        clientName: 'recorder3',
        type: 'certificate',
        action: 'delete',
        status: 'fail',
        statusCode: 404,
      },
    ])
    .run(async ({ assert }, content) => {
      nock.recorder.rec({ dont_print: true, output_objects: true })
      const yamls = loadYamls({ CLIENT_NAME: content.clientName })
      const kc = new KubeConfig()
      kc.loadFromOptions(K8sConfig)
      const statful = new Statefulset(kc)
      const service = new Service(kc)
      const ingress = new Ingress(kc)
      const certificate = new Certificate(kc)

      switch (content.type) {
        case 'statefulset':
          if (content.action === 'create') {
            await statful.createStateful(yamls['01StatefulSet.yml'])
          } else if (content.action === 'delete') {
            await statful.deleteStateful(content.clientName)
          }
          break
        case 'service':
          if (content.action === 'create') {
            await service.createService(yamls['02Service.yml'])
          } else if (content.action === 'delete') {
            await service.deleteService(content.clientName)
          }
          break
        case 'ingress':
          if (content.action === 'create') {
            await ingress.createIngress(yamls['04Ingress.yml'])
          } else if (content.action === 'delete') {
            await ingress.deleteIngress(content.clientName)
          }
          break
        case 'certificate':
          if (content.action === 'create') {
            await certificate.createCertificate(yamls['03Certificate.yml'])
          } else if (content.action === 'delete') {
            await certificate.deleteCertificate(content.clientName)
          }
          break
      }

      nock.restore()
      const record = nock.recorder.play()
      await saveTape(`${content.type}-${content.action}-${content.status}`, record)
      assert.containsSubset(record, [{ status: content.statusCode }])
      nock.recorder.clear()
    })
})
