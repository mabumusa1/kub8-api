declare module '@ioc:K8s/K8sClient' {
  export interface K8sClientContract {
    createInstall(resourceName: string): Promise<any>
    deleteInstall(resourceName: string): Promise<any>
    setDomain(resourceName: string, domainName: string): Promise<any>
  }

  const K8sClient: K8sClientContract
  export default K8sClient
}
