import mysql from 'mysql2/promise'
import GenericK8sException from 'App/Exceptions/GenericK8sException'
import Env from '@ioc:Adonis/Core/Env'

export class Database {
  protected resourceName: String
  protected password: String
  constructor(resourceName: string, password: string) {
    this.resourceName = resourceName
    this.password = password
  }

  private async runQuery(query: string, data?: []) {
    try {
      const conn = await mysql.createConnection({
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USERNAME'),
        password: Env.get('DB_PASSWORD'),
      })
      const [rows, fields] = await conn.execute(query, data)
      await conn.end()
      return [rows, fields]
    } catch (error) {
      throw new GenericK8sException(error.message)
    }
  }

  private async checkIfDatabaseExists() {
    const [rows] = await this.runQuery(`SHOW DATABASES LIKE '${this.resourceName}'`)
    if (rows.length > 0) {
      throw new GenericK8sException('Database already exists')
    }
  }

  private async checkIfUserExists() {
    const [rows] = await this.runQuery(
      `select user, host from mysql.user where user = '${this.resourceName}' and host = '%'`
    )
    if (rows.length > 0) {
      throw new GenericK8sException('Database User already exists')
    }
  }

  public async createDatabase(dryRun?: string) {
    if (dryRun) {
      await this.checkIfDatabaseExists()
      await this.checkIfUserExists()
    } else {
      try {
        await this.runQuery(
          `CREATE USER '${this.resourceName}'@'%' IDENTIFIED BY '${this.password}'`
        )
        await this.runQuery(`CREATE DATABASE ${this.resourceName}`)
        await this.runQuery(`GRANT ALL ON ${this.resourceName}.* TO '${this.resourceName}'@'%'`)
      } catch (e) {
        throw new GenericK8sException(e)
      }
    }
  }
}
