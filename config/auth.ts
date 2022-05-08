/**
 * Config source: https://git.io/JY0mp
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

/*
|--------------------------------------------------------------------------
| Authentication Mapping
|--------------------------------------------------------------------------
|
| List of available authentication mapping. You must first define them
| inside the `contracts/auth.ts` file before mentioning them here.
|
*/
const authConfig: AuthConfig = {
  guard: 'basic',
  guards: {
    /*
    |--------------------------------------------------------------------------
    | Basic Auth Guard
    |--------------------------------------------------------------------------
    |
    | Uses Basic auth to authenticate an HTTP request. There is no concept of
    | "login" and "logout" with basic auth. You just authenticate the requests
    | using a middleware and browser will prompt the user to enter their login
    | details
    |
    */
    basic: {
      driver: 'basic',
      realm: 'Login',

      provider: {
        driver: 'simple',
        uids: ['password'],
      },
    },
  },
}

export default authConfig
