import mysql from 'mysql2/promise'
import Env from '@ioc:Adonis/Core/Env'

export class DatabaseTestHelper {
  public static async clearDatabase() {
    const conn = await mysql.createConnection({
      host: Env.get('DB_HOST'),
      user: Env.get('DB_USERNAME'),
      password: Env.get('DB_PASSWORD')
    })
    await conn.execute(`drop user IF EXISTS 'recorder3'@'%';`)
    await conn.execute(`drop database IF EXISTS recorder3;`)
    
  }
}
