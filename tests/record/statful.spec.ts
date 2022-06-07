import { test } from '@japa/runner'
import nock from 'nock'
import { saveTape } from '../helpers/saveTape'
import { KubeConfig } from '@kubernetes/client-node'
import { Statefulset } from '../../providers/K8sClient/Statefulset'
import { loadYamls } from '../../providers/K8sClient/Helpers'
import { K8sConfig } from 'Config/k8s'

test.group('recordResponse', (group) => {
  group.each.setup(() => {})

  test('K8s create calls', async () => {
    const yamls = loadYamls({ CLIENT_NAME: 'recorder3' })
    const kc = new KubeConfig()
    kc.loadFromOptions(K8sConfig)
    const statful = new Statefulset(kc)

    nock.recorder.rec({ dont_print: false, output_objects: false })
    await statful.deleteStateful('recorder3')
    nock.restore()

    const record = nock.recorder.play()
    await saveTape('create-exists', record)
    nock.recorder.clear()
  })
})
