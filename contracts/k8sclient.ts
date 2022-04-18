declare module '@ioc:K8s/Client' {
  import K8sWrapper from 'providers/K8sProvider/K8s'

  const K8sClient: K8sWrapper

  export default K8sClient
}
