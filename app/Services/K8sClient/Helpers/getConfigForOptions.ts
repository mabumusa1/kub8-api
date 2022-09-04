import { Cluster } from '@aws-sdk/client-eks'
import Env from '@ioc:Adonis/Core/Env'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'

function getClusterConfig(arn, certificate, endpoint) {
  return {
    cluster: {
      caData: certificate,
      server: endpoint,
    },
    name: arn,
  }
}

async function getToken(clusterName: string) {
  const signer = new SignatureV4({
    credentials: {
      accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
    },
    region: Env.get('AWS_REGION'),
    service: 'sts',
    sha256: Sha256,
  })

  const request = await signer.presign(
    {
      headers: {
        'host': `sts.${Env.get('AWS_REGION')}.amazonaws.com`,
        'x-k8s-aws-id': clusterName,
      },
      hostname: `sts.${Env.get('AWS_REGION')}.amazonaws.com`,
      method: 'GET',
      path: '/',
      protocol: 'https:',
      query: {
        Action: 'GetCallerIdentity',
        Version: '2011-06-15',
      },
    },
    { expiresIn: 0 }
  )

  const query = Object.keys(request?.query ?? {})
    .map((q) => encodeURIComponent(q) + '=' + encodeURIComponent(request.query?.[q] as string))
    .join('&')

  const url = `https://${request.hostname}${request.path}?${query}`
  return 'k8s-aws-v1.' + Buffer.from(url).toString('base64url')
}

async function getUserConfig(clusterName: string, clusterUser: any) {
  return {
    name: clusterUser,
    token: await getToken(clusterName),
  }
}

function getContextConfig(arn, contextName, clusterUser) {
  return {
    context: {
      cluster: arn,
      user: clusterUser,
    },
    name: contextName,
  }
}

/**
 * Function that returns the configuration of kubernetes
 * @param    {String} clusterName    Name of the cluster
 * @return   {Object}                kube.config JS object
 */

export default async (cluster: Cluster, region: string) => {
  const { arn, certificateAuthority, endpoint } = cluster
  const certificate = certificateAuthority?.data
  const clusterName = Env.get('K8S_CLUSTER_NAME')

  const clusterConfig = getClusterConfig(arn, certificate, endpoint)
  const user = await getUserConfig(clusterName, arn)
  const context = getContextConfig(arn, arn, arn)

  return {
    region,
    clusters: [clusterConfig],
    contexts: [context],
    currentContext: arn,
    preferences: {},
    users: [user],
  }
}
