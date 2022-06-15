import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
const axios = require('axios').default

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {}

  public async boot() {
    const HealthCheck = this.app.container.use('Adonis/Core/HealthCheck')

    HealthCheck.addChecker('k8s_server', async () => {
      const instance = axios.create({
        baseURL: Env.get('K8S_API_URL'),
      })
      var message = ''
      var healthy = false
      try {
        const response = await instance.get('livez')
        message = response.data
        healthy = true
      } catch (error) {
        message = error.message
      }

      return {
        displayName: 'K8s Health',
        health: {
          healthy: healthy,
          message: message,
        },
      }
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
