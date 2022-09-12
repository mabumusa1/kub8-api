var mysql = require('mysql')
import Env from '@ioc:Adonis/Core/Env'

export class Database {
  protected resourceName: String
  protected password: String
  constructor(resourceName: string, password: string) {
    this.resourceName = resourceName
    this.password = password
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
              CREATE USER '${this.resourceName}'@'%' IDENTIFIED BY '${this.password}';
              CREATE DATABASE ${this.resourceName};
              GRANT ALL ON ${this.resourceName}.* TO '${this.resourceName}'@'%';
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
