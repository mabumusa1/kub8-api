declare module '@ioc:K8s/Client' {
  import { K8sClientProvider } from 'providers/K8sClientProvider'

  const K8sClient: K8sClientProvider

  export default K8sClient
}
