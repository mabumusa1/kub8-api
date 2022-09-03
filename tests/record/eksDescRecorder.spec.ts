import { test } from '@japa/runner'
import nock from 'nock'
import { saveTape } from '../helpers/saveTape'
import K8sClient from '../../app/Services/K8sClient'

test.group('record EKS Response', () => {
  test('Record responses').run(async ({ assert }) => {
    nock.recorder.rec({ dont_print: true, output_objects: true })
    await K8sClient.initialize()
    nock.restore()
    const record = nock.recorder.play()
    await saveTape(`eksDesc`, record)
    assert.containsSubset(record, [{ status: 200 }])
    nock.recorder.clear()
  })
})
