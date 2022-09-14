import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateInstallValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    id: schema.string({}, [rules.regex(/^[a-z0-9_-]*$/)]),
    env_type: schema.enum(['dev', 'prd'] as const),
    size: schema.object().members({
      cpu: schema.number([rules.range(1, 32)]),
      memory: schema.string({}, [rules.regex(/^([+-]?\d+)([KMGTPEZY]i|[KMGTPEZY]|)$/)]),
    }),
    adminFirstName: schema.string({}),
    adminLastName: schema.string({}),
    adminEmail: schema.string({}, [rules.email()]),
    adminPassword: schema.string({}, [rules.minLength(8)]),
    dbPassword: schema.string({}, [rules.minLength(8)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    id: 'Install ID is required',
    env_type: 'Install enviroment type must be either dev,prd',
    size: 'Size of the install cpu and memory must be specified',
    adminFirstName: 'Admin first name is required',
    adminLastName: 'Admin last name is required',
    adminEmail: 'Admin email is required',
    adminPassword: 'Admin password is required',
    dbPassword: 'Database password is required',
  }
}
