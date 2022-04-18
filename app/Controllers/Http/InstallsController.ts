import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateInstallValidator from 'App/Validators/CreateInstallValidator'
import UpdateInstallValidator from 'App/Validators/UpdateInstallValidator'
import SetDomainValidator from 'App/Validators/SetDomainValidator'
import K8sClient from '@ioc:K8s/Client'

export default class InstallsController {
  public async create({ request, response }: HttpContextContract) {
    await request.validate(CreateInstallValidator)

    // Check if any resources exist with same name

    /*const StatefulSetExist = await K8sClient.isStatefulSetExist('moe')
    const ServiceExist = await K8sClient.isServiceExist('moe')
    const IngressExist = await K8sClient.isIngressExist('moe')
    const CertificateExist = await K8sClient.isCertificateExist('moe')*/


    /*const StatefulSetExist = K8sClient.isStatefulSetExist('moe')
      .then(function (res) {
        console.log('test ' + res)
      })
      .catch(function (err) {
        response.status(403).send({
          status: 'Failed',
          message: err.message,
          debug: err.body,
        })
      })*/

    //console.log(StatefulSetExist + ' ' + ServiceExist + ' ' +IngressExist + ' ' +CertificateExist)

    //console.log('LOG ' + StatefulSetExist)


    //return;

    //K8sClient.isStatefulSetExist('moe').then(function (res) {StatefulSetExist = response})
    /*K8sClient.isServiceExist('moe').then(function (res) {ServiceExist = res})
    K8sClient.isIngressExist('moe').then(function (res) {IngressExist = res})
    K8sClient.isCertificateExist('moe').then(function (res) {CertificateExist = res})*/

    /*if (StatefulSetExist) { //|| ServiceExist || IngressExist || CertificateExist){
      console.log('The resources exists')
      return;
    }*/

    return K8sClient.isStatefulSetExist('moe')
      .then(function (res) {
        return K8sClient.isServiceExist('moe')
          .then(function (res) {
            return K8sClient.isIngressExist('moe')
              .then(function (res) {
                return K8sClient.isCertificateExist('moe')
                  .then(function (res) {
                    // create statefullset
                    const statefulsetYml = K8sClient.loadYaml('01StatefulSet', { find: '{ CLIENT_NAME }', replace: 'moe' })
                    return K8sClient.createStateful(statefulsetYml)
                      .then(function (res) {
                        // sucess code
                        // create service
                        const serviceYml = K8sClient.loadYaml('02Service', { find: '{ CLIENT_NAME }', replace: 'moe' })
                        return K8sClient.createService(serviceYml)
                          .then(function (res) {
                            // success code
                            // create certificate
                            const certificateYml = K8sClient.loadYaml('03Certificate', { find: '{ CLIENT_NAME }', replace: 'moe' })
                            return K8sClient.createCertificate(certificateYml)
                              .then(function (res) {
                                // success code
                                // create ingress
                                const ingressYml = K8sClient.loadYaml('04Ingress', { find: '{ CLIENT_NAME }', replace: 'moe' })
                                return K8sClient.createIngress(ingressYml)
                                  .then(function (res) {
                                    response.send({
                                      status: 'success',
                                      message: 'Install creation request accepted',
                                      debug: res.body,
                                    })
                                  })
                                  .catch(function (err) {
                                    response.status(403).send({
                                      status: 'createIngress Failed',
                                      message: err.message,
                                      debug: err.body,
                                    })
                                  })
                              })
                              .catch(function (err) {
                                response.status(403).send({
                                  status: 'createCertificate Failed',
                                  message: err.message,
                                  debug: err.body,
                                })
                              })
                          })
                          .catch(function (err) {
                            response.status(403).send({
                              status: 'createService Failes',
                              message: err.message,
                              debug: err.body,
                            })
                          })
                      })
                      .catch(function (err) {
                        response.status(403).send({
                          status: 'createStateful Failes',
                          message: err.message,
                          debug: err.body,
                        })
                      })
                  })
                  .catch(function (err) {
                    response.status(403).send({
                      status: 'isIngressExist  Already Exists',
                      message: err.message,
                      debug: err.body,
                    })
                  })
              })
              .catch(function (err) {
                response.status(403).send({
                  status: 'ServiceExist  Already Exists',
                  message: err.message,
                  debug: err.body,
                })
              })
          })
          .catch(function (err) {
            response.status(403).send({
              status: 'StatefulSetExist Already Exists',
              message: err.message,
              debug: err.body,
            })
          })
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
