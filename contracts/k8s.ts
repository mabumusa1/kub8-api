declare module '@ioc:K8s/K8sClient' {
  export interface K8sClientContract {
    createInstall(resourceName: string, dryRun?: string)
    canCreateInstall(resourceName: string, dryRun?: string)
    deleteInstall(resourceName: string, dryRun?: string)
    setDomain(resourceName: string, domainName: string, dryRun?: string)
  }

  const K8sClient: K8sClientContract
  export default K8sClient
}
