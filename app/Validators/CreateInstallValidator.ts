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
    id: schema.string({ trim: true }, [rules.regex(/^[a-zA-Z0-9]+$/)]),
    env_type: schema.enum(['dev', 'stg', 'prd'] as const),
    size: schema.enum(['s1', 's2', 's3', 's4', 's5', 'custom']),
    domain: schema.string({}, [
      rules.regex(/^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/),
    ]),
    region: schema.string.optional(),
    custom: schema.object.optional().members({
      cpu: schema.string.optional({}, [rules.requiredWhen('size', '=', 'custom')]), //TODO: Implement validation for specific type so of CPU
      memory: schema.string.optional({}, [rules.requiredWhen('size', '=', 'custom')]), //TODO: Implement validation for specific type of memory
    }),
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
    env_type: 'Install enviroment type must be either dev,stg,prd',
    size: 'Size of the install should be between s1 and s5 or custom',
    domain: 'Invalid domain format',
    region: 'Invalid region type',
    custom: 'Invalid custom install size, please specify the cpu and memory',
  }
}
