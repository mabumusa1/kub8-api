import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import isReachable from 'is-reachable'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {}

  public async boot() {
    const HealthCheck = this.app.container.use('Adonis/Core/HealthCheck')

    HealthCheck.addChecker('token', async () => {
      const token = Env.get('TOKEN')
      return {
        displayName: 'Token Check',
        health: {
          healthy: token ? true : false,
        },
      }
    })

    HealthCheck.addChecker('k8s_api', async () => {
      const K8S_API_URL = Env.get('K8S_API_URL')
      return {
        displayName: 'K8S_API_URL Check',
        health: {
          healthy: K8S_API_URL ? true : false,
        },
      }
    })

    HealthCheck.addChecker('k8s_api_can_connect', async () => {
      const K8S_API_URL = Env.get('K8S_API_URL')
      const canReach = await isReachable(K8S_API_URL)
      if (canReach) {
        return {
          displayName: 'K8s can connect Check',
          health: {
            healthy: true,
          },
        }
      } else {
        return {
          displayName: 'K8s can connect Check',
          health: {
            healthy: false,
          },
        }
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
