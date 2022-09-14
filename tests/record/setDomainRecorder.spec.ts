import { test } from '@japa/runner'
import nock from 'nock'
import { saveTape } from '../helpers/saveTape'
import K8sClient from 'App/Services/K8sClient'

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
        type: 'create',
      },
    ])
    .run(async ({ assert }, content) => {
      nock.recorder.rec({ dont_print: true, output_objects: true })
      const k8sClient = await K8sClient.initialize()
      switch (content.type) {
        case 'create':
          await k8sClient.setDomain('recorder3', 'domain.com')
      }

      nock.restore()
      const record = nock.recorder.play()
      await saveTape(`setDomain-${content.type}`, record)
      assert.ok(record)
      nock.recorder.clear()
    })
})
