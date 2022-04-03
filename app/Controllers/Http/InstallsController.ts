import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { k8s } from '@kubernetes/client-node'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import UpdateInstallValidator from 'App/Validators/UpdateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'




export default class InstallsController {
  
  
  public async create({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    console.log('Test2');

    kc = new k8s.KubeConfig();
    /*kc.addCluster({
      name: 'testCluster',
      server: `http://localhost:8001`,
      skipTLSVerify: true,
  });*/

  //  kc.loadFromDefault();
    /*const cluster = {
      name: 'dev-cluster-mininikube',
      server: 'http://localhost:8001',
  };*/
  
  
  /*const context = {
      name: 'my-context',
      //user: user.name,
      cluster: cluster.name,
  };*/
  
  //const kc = new k8s.KubeConfig();
/*  k8s.loadFromOptions({
    clusters: [{ name: 'dc', server: 'http://localhost:8001' }],
    users: [{ name: 'ian', password: 'mackaye' }],
    contexts: [{ name: 'dischord', cluster: 'dc', user: 'ian', namespace: 'default' }],
    currentContext: 'dischord',
});*/
  /*kc.loadFromCluster();*/


  /*kc.loadFromOptions({
    clusters: [{ name: 'dc', server: 'http://localhost:8001' }],
    users: [{ name: 'ian', password: 'mackaye' }],
    contexts: [{ name: 'dischord', cluster: 'dc', user: 'ian', namespace: 'default' }],
    currentContext: 'dischord',
});*/
  /*kc.loadFromOptions({
      clusters: [cluster],
      contexts: [context],
      currentContext: context.name,
  });*/
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    //k8sApi.listNamespacedPod('default').then((res) => {
    //    console.log(res.body);
    //});

    // createNamespacedStatefulSet(namespace: string, body: V1StatefulSet, pretty?: string, dryRun?: string, fieldManager?: string, options?: { headers: {} }): Promise<{ body: V1StatefulSet; response: IncomingMessage }>
    return response.created({
      status: 'success2',
      message: 'Install creation request accepted',
    })
  }

  public async update({ request, response }: HttpContextContract) {
    await request.validate(UpdateInstallValidator)
    response.created({
      status: 'success',
      message: 'Install resize request accepted',
    })
  }

  public async delete({ request, response }: HttpContextContract) {
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install destroy request accepted',
    })
  }

  public async copy({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)
    response.created({
      status: 'success',
      message: 'Install copy request accepted',
    })
  }

  public async stop({ request, response }: HttpContextContract) {
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install stop request accepted',
    })
  }

  public async backup({ request, response }: HttpContextContract) {
    console.log(request)
    response.created({
      status: 'success',
      message: 'Install backup request accepted',
    })
  }

  public async setDomain({ request, response }: HttpContextContract) {
    await request.validate(SetDomainValidator)
    response.created({
      status: 'success',
      message: 'Domain mapping request accepted',
    })
  }
}
