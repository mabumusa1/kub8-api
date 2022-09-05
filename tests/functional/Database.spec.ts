import { test } from '@japa/runner'
import { Database } from '../../app/Services/K8sClient/Database'
import { DatabaseTestHelper } from '../helpers/DatabaseTestHelper'
import Env from '@ioc:Adonis/Core/Env'

test.group('Error creating database', (group) => {
  group.each.setup(async () => {
    DatabaseTestHelper.clearDatabase()
  })

  test('create database error due to query').run(async ({ assert }) => {
    const database = new Database('test')
    await assert.rejects(async () => {
      await database.createDatabase()
    }, "ER_CANNOT_USER: Operation CREATE USER failed for 'test'@'%'")
  })

  test('create database error due to connection').run(async ({ assert }) => {
    const oldDbHost = Env.get('DB_HOST')
    Env.set('DB_HOST', 'fakehost')
    const database = new Database('test')
    await assert.rejects(async () => {
      await database.createDatabase()
    })

    Env.set('DB_HOST', oldDbHost)
  })
})
