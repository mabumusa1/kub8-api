import Application from '@ioc:Adonis/Core/Application'
import { fsReadAll } from '@ioc:Adonis/Core/Helpers'
import { readFileSync } from 'fs-extra'
import { load } from 'js-yaml'
import { interpolate } from '@ioc:Adonis/Core/Helpers'

/**
 * Load the k8s yaml file
 *
 * @param   {string}  fileName  Yaml file that should be loaded
 * @param   {Object}  replace   Replce the content of the file, with the given object
 *
 * @return  {Object}            Yaml file content as an object
 */

export function loadYamls(replace: Object): Object {
  const files = fsReadAll(Application.makePath('yamls'), (filePath: string) => {
    return filePath.endsWith('.yml')
  })

  var yamls = {}
  files.forEach((file) => {
    const template = readFileSync(Application.makePath('yamls/') + file, 'utf8')
    yamls[file] = load(interpolate(template, replace))
  })

  return yamls
}
