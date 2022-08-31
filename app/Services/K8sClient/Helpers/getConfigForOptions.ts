import { Cluster } from "@aws-sdk/client-eks";
import Env from '@ioc:Adonis/Core/Env'


function getClusterConfig(arn, certificate, endpoint) {
    return {
        cluster: {
            caData: certificate,
            server: endpoint
        },
        name: arn
    };
};

function getUserConfig(clusterName: string, clusterUser: any, command: string) {
    return {
        name: clusterUser,
        user: {
            authProvider: {
                name: 'exec',
                config: {
                    exec: {
                        command,
                        args: [
                            'eks',
                            'get-token',
                            '--cluster-name',
                            clusterName,
                            '--profile',
                            'default'
                        ]
                    }
                }
            }
        }
    };
};

function getContextConfig(arn, contextName, clusterUser) {
    return {
        context: {
            cluster: arn,
            user: clusterUser
        },
        name: contextName
    };
};

/**
* Function that returns the configuration of kubernetes
* @param    {String} clusterName    Name of the cluster
* @param    {String} command        Path to the aws-iam-authenticator executable inside the lambda
* @return   {Object}                kube.config JS object
*/

module.exports = (cluster: Cluster, region: string, command: string) => {
    const { arn, certificateAuthority, endpoint } = cluster;
    const certificate = certificateAuthority?.data
    const clusterName = Env.get('K8S_CLUSTER_NAME')

    const clusterConfig = getClusterConfig(arn, certificate, endpoint);
    const user = getUserConfig(clusterName, arn, command);
    const context = getContextConfig(arn, arn, arn);

    return {
        region,
        clusters: [clusterConfig],
        contexts: [context],
        currentContext: arn,
        preferences: {},
        users: [user]
    };
};