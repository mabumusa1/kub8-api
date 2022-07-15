var mysql = require('mysql')
import Env from '@ioc:Adonis/Core/Env'

export class Database {
  protected resourceName: String
  constructor(resourceName: string) {
    this.resourceName = resourceName
  }
  public async createDatabase() {
    return new Promise((resolve, reject) => {
      var con = mysql.createConnection({
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USERNAME'),
        password: Env.get('DB_PASSWORD'),
        multipleStatements: true,
      })
      const q = `
              CREATE USER '${this.resourceName}'@'%' IDENTIFIED WITH 'mysql_native_password' by 'QAZ2wsx3edc4rfv';
              create database ${this.resourceName};
              grant all on ${this.resourceName}.* to '${this.resourceName}'@'%';
            `

      con.connect(function (err) {
        if (err) {
          return reject(err)
        }
      })
      return con.query(q, function (err) {
        if (err) {
          return reject(err)
        } else {
          return resolve(true)
        }
      })
    })
  }
}
