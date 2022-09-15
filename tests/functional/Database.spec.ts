import { test } from '@japa/runner'
import { Database } from '../../app/Services/K8sClient/Database'

import mysql from 'mysql2/promise'
import Env from '@ioc:Adonis/Core/Env'

test.group('Error creating database', (group) => {
  group.each.setup(async () => {
    const conn = await mysql.createConnection({
      host: Env.get('DB_HOST'),
      user: Env.get('DB_USERNAME'),
      password: Env.get('DB_PASSWORD'),
    })
    await conn.execute('DROP DATABASE IF EXISTS testdb')
    await conn.execute("DROP USER IF EXISTS 'testdb'@'%';")
  })

  test('create database error due to query').run(async ({ assert }) => {
    const database = new Database('*', 'password')
    await assert.rejects(async () => {
      await database.createDatabase()
    })
  })

  test('create database error due to connection').run(async ({ assert }) => {
    const oldDbHost = Env.get('DB_HOST')
    Env.set('DB_HOST', 'fakehost')
    const database = new Database('***', 'password')
    await assert.rejects(async () => {
      await database.createDatabase()
    })

    Env.set('DB_HOST', oldDbHost)
  })

  test('dryRun tests database exists').run(async ({ assert }) => {
    await assert.rejects(async () => {
      const conn = await mysql.createConnection({
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USERNAME'),
        password: Env.get('DB_PASSWORD'),
      })
      await conn.execute('CREATE DATABASE testdb')
      const database = new Database('testdb', 'password')
      await database.createDatabase('All')
    }, 'Database already exists')
  })

  test('dryRun tests user exists').run(async ({ assert }) => {
    await assert.rejects(async () => {
      const conn = await mysql.createConnection({
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USERNAME'),
        password: Env.get('DB_PASSWORD'),
      })
      await conn.execute("CREATE USER 'testdb'@'%' IDENTIFIED BY 'password'")
      const database = new Database('testdb', 'password')
      await database.createDatabase('All')
    }, 'Database User already exists')
  })
})
