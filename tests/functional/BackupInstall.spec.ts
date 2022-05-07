import { test } from '@japa/runner'

test.group('Backups', () => {
  test('Backup.validation', async ({client, assert}, type) => {
    const response = await client.post(`/v1/install/iab/backup/${type.type}`)
    response.assertStatus(type.responseCode)    
  }).with([
    {
      type: "automated", 
      responseCode: 201
    },
    {
      type: "user", 
      responseCode: 201
    },
    {
      type: "wrong", 
      responseCode: 404
    },
  ])

  test('Backup.success', async ({client}) => {
    const response = await client.post(`/v1/install/iab/backup/user`)
    response.assertStatus(201)
    response.assertAgainstApiSpec()
    response.assertBodyContains({
      status: 'success',
      message: 'Install backup request accepted',
    })

    response.assertAgainstApiSpec()
  })
})