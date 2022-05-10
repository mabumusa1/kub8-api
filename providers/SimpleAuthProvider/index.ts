import type { UserProviderContract, ProviderUserContract } from '@ioc:Adonis/Addons/Auth'
import Env from '@ioc:Adonis/Core/Env'

/**
 * Shape of the user object returned by the "SimpleAuthProvider"
 * class. Feel free to change the properties as you want
 */
export type User = {
  token: string
}

/**
 * The shape of configuration accepted by the SimpleAuthProvider.
 * At a bare minimum, it needs a driver property
 */
export type SimpleAuthProviderConfig = {
  driver: 'simple'
}

/**
 * Provider user works as a bridge between your User provider and
 * the AdonisJS auth module.
 */
class ProviderUser implements ProviderUserContract<User> {
  constructor(public user: User | null) {}

  public async verifyPassword(token: string) {
    const tokens = JSON.parse(Env.get('TOKENS'))
    if (tokens.includes(token)) {
      return true
    } else {
      throw new Error('Invalid token')
    }
  }
}

/**
 * The User provider implementation to lookup a user for different
 * operations
 */
export class SimpleAuthProvider implements UserProviderContract<User> {
  constructor(public config: SimpleAuthProviderConfig) {}

  public async getUserFor(user: User | null) {
    return new ProviderUser(user)
  }

  public async findByUid(token: string) {
    return this.getUserFor({ token: token })
  }
}
