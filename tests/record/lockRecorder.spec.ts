import { test } from '@japa/runner'
import nock from 'nock'
import { saveTape } from '../helpers/saveTape'
import K8sClient from '../../app/Services/K8sClient'

test.group('record Lock Response', () => {
  test('Record responses').run(async ({ assert }) => {
    const k8sClient: K8sClient = await K8sClient.initialize()
    nock.recorder.rec({ dont_print: true, output_objects: true })
    await k8sClient.lockInstall('opo', 'password')
    nock.restore()
    const record = nock.recorder.play()
    await saveTape(`lock-attach-secret-success`, record)
    assert.containsSubset(record, [{ status: 200 }])
    nock.recorder.clear()
  })
})
