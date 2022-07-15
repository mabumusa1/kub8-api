var mysql = require('mysql')
import Env from '@ioc:Adonis/Core/Env'

export class DatabaseTestHelper {
  static async clearDatabase() {
    return new Promise((resolve, reject) => {
      var con = mysql.createConnection({
        host: Env.get('DB_HOST'),
        user: Env.get('DB_USERNAME'),
        password: Env.get('DB_PASSWORD'),
        multipleStatements: true,
      })
      const q = `drop user IF EXISTS 'recorder3'@'%';drop database IF EXISTS recorder3;`

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
