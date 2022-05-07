import Env from '@ioc:Adonis/Core/Env'

export const K8sConfig = {
  contexts: [{ cluster: 'cluster', user: 'user', name: 'loaded-context' }],
  clusters: [{ name: 'cluster', server: Env.get('K8S_API_URL') }],
  users: [{ name: 'user' }],
  currentContext: 'loaded-context',
}
