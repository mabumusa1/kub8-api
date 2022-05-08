import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('App/API/V1', () => {
      const AppApi = require('./AppApi.ts').default

      return new AppApi()
    })
  }

  public async boot() {
    const Auth = this.app.container.resolveBinding('Adonis/Addons/Auth')
    const { SimpleAuthProvider } = await import('./SimpleAuthProvider')
    Auth.extend('provider', 'simple', (_, __, config) => {
      return new SimpleAuthProvider(config)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
