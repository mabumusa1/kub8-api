import fs from 'fs'
import { Definition } from 'nock/types'
import path from 'path'

export const saveTape = (tapeName: string, data: string[] | Definition[] | string | Definition) => {
  return new Promise<void>((resolve) => {
    fs.mkdir(path.join(__dirname, 'kub8Response'), () => {
      fs.writeFile(`${__dirname}/kub8Response/${tapeName}.json`, JSON.stringify(data), (err) => {
        if (err) {
          return console.error(err)
        }
        resolve()
      })
    })
  })
}
