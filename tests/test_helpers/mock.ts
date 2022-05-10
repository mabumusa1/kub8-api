import nock from 'nock'

export function mockCreateKubApiSuccess() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .reply(201, (_, '{"kind":"StatefulSet","apiVersion":"apps/v1","metadata":{"name":"iab","namespace":"default","uid":"1265998f-6641-4e04-8055-904413e4d5f7","resourceVersion":"3083854","generation":1,"creationTimestamp":"2022-05-10T12:27:12Z","annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"apps/v1\",\"kind\":\"StatefulSet\",\"metadata\":{\"annotations\":{},\"name\":\"iab\",\"namespace\":\"default\"},\"spec\":{\"replicas\":1,\"selector\":{\"matchLabels\":{\"app\":\"iab\"}},\"serviceName\":\"iab\",\"template\":{\"metadata\":{\"labels\":{\"app\":\"iab\"}},\"spec\":{\"containers\":[{\"image\":\"nginx\",\"name\":\"iab\",\"ports\":[{\"containerPort\":80,\"name\":\"iab\"}]}],\"restartPolicy\":\"Always\",\"terminationGracePeriodSeconds\":10}}}}\n"},"managedFields":[{"manager":"kubectl","operation":"Update","apiVersion":"apps/v1","time":"2022-05-10T12:27:12Z","fieldsType":"FieldsV1","fieldsV1":{"f:spec":{"f:podManagementPolicy":{},"f:replicas":{},"f:revisionHistoryLimit":{},"f:selector":{},"f:serviceName":{},"f:template":{"f:metadata":{"f:labels":{".":{},"f:app":{}}},"f:spec":{"f:containers":{"k:{\"name\":\"iab\"}":{".":{},"f:image":{},"f:imagePullPolicy":{},"f:name":{},"f:ports":{".":{},"k:{\"containerPort\":80,\"protocol\":\"TCP\"}":{".":{},"f:containerPort":{},"f:name":{},"f:protocol":{}}},"f:resources":{},"f:terminationMessagePath":{},"f:terminationMessagePolicy":{}}},"f:dnsPolicy":{},"f:restartPolicy":{},"f:schedulerName":{},"f:securityContext":{},"f:terminationGracePeriodSeconds":{}}},"f:updateStrategy":{"f:rollingUpdate":{".":{},"f:partition":{}},"f:type":{}}}}},{"manager":"kube-controller-manager","operation":"Update","apiVersion":"apps/v1","time":"2022-05-10T12:27:16Z","fieldsType":"FieldsV1","fieldsV1":{"f:status":{"f:availableReplicas":{},"f:collisionCount":{},"f:currentReplicas":{},"f:currentRevision":{},"f:observedGeneration":{},"f:readyReplicas":{},"f:replicas":{},"f:updateRevision":{},"f:updatedReplicas":{}}},"subresource":"status"},{"manager":"kubectl-client-side-apply","operation":"Update","apiVersion":"apps/v1","time":"2022-05-10T12:48:32Z","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:kubectl.kubernetes.io/last-applied-configuration":{}}}}}]},"spec":{"replicas":1,"selector":{"matchLabels":{"app":"iab"}},"template":{"metadata":{"creationTimestamp":null,"labels":{"app":"iab"}},"spec":{"containers":[{"name":"iab","image":"nginx","ports":[{"name":"iab","containerPort":80,"protocol":"TCP"}],"resources":{},"terminationMessagePath":"/dev/termination-log","terminationMessagePolicy":"File","imagePullPolicy":"Always"}],"restartPolicy":"Always","terminationGracePeriodSeconds":10,"dnsPolicy":"ClusterFirst","securityContext":{},"schedulerName":"default-scheduler"}},"serviceName":"iab","podManagementPolicy":"OrderedReady","updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}},"revisionHistoryLimit":10},"status":{"observedGeneration":1,"replicas":1,"readyReplicas":1,"currentReplicas":1,"updatedReplicas":1,"currentRevision":"iab-5655b8b7cf","updateRevision":"iab-5655b8b7cf","collisionCount":0,"availableReplicas":1}}') => {
      return {}
    })
    .post('/api/v1/namespaces/default/services')
    .reply(201, (_, '{"kind":"Service","apiVersion":"v1","metadata":{"name":"iab","namespace":"default","uid":"15d3b391-c35e-4724-822f-86d2841881f1","resourceVersion":"3084481","creationTimestamp":"2022-05-10T12:27:12Z","labels":{"app":"iab"},"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"v1\",\"kind\":\"Service\",\"metadata\":{\"annotations\":{},\"labels\":{\"app\":\"iab\"},\"name\":\"iab\",\"namespace\":\"default\"},\"spec\":{\"ipFamilies\":[\"IPv4\"],\"ipFamilyPolicy\":\"SingleStack\",\"ports\":[{\"port\":80,\"protocol\":\"TCP\",\"targetPort\":80}],\"selector\":{\"app\":\"iab\"},\"sessionAffinity\":\"None\",\"type\":\"ClusterIP\"}}\n"},"managedFields":[{"manager":"kubectl","operation":"Update","apiVersion":"v1","time":"2022-05-10T12:27:12Z","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:labels":{".":{},"f:app":{}}},"f:spec":{"f:internalTrafficPolicy":{},"f:ipFamilies":{},"f:ipFamilyPolicy":{},"f:ports":{".":{},"k:{\"port\":80,\"protocol\":\"TCP\"}":{".":{},"f:port":{},"f:protocol":{},"f:targetPort":{}}},"f:selector":{},"f:sessionAffinity":{},"f:type":{}}}},{"manager":"kubectl-client-side-apply","operation":"Update","apiVersion":"v1","time":"2022-05-10T12:59:14Z","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:kubectl.kubernetes.io/last-applied-configuration":{}}}}}]},"spec":{"ports":[{"protocol":"TCP","port":80,"targetPort":80}],"selector":{"app":"iab"},"clusterIP":"10.100.65.23","clusterIPs":["10.100.65.23"],"type":"ClusterIP","sessionAffinity":"None","ipFamilies":["IPv4"],"ipFamilyPolicy":"SingleStack","internalTrafficPolicy":"Cluster"},"status":{"loadBalancer":{}}}') => {
      return {}
    })
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .reply(201, (_, '{"kind":"Ingress","apiVersion":"networking.k8s.io/v1","metadata":{"name":"iab","namespace":"default","uid":"1f74d220-0d1c-4904-83a0-4a8e26867c34","resourceVersion":"3084703","generation":1,"creationTimestamp":"2022-05-10T13:02:45Z","annotations":{"cert-manager.io/cluster-issuer":"letsencrypt-prod-ingress","kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"networking.k8s.io/v1\",\"kind\":\"Ingress\",\"metadata\":{\"annotations\":{\"cert-manager.io/cluster-issuer\":\"letsencrypt-prod-ingress\"},\"name\":\"iab\",\"namespace\":\"default\"},\"spec\":{\"ingressClassName\":\"nginx\",\"rules\":[{\"host\":\"iab.steercampaign.com\",\"http\":{\"paths\":[{\"backend\":{\"service\":{\"name\":\"iab\",\"port\":{\"number\":80}}},\"path\":\"/\",\"pathType\":\"ImplementationSpecific\"}]}}],\"tls\":[{\"hosts\":[\"iab.steercampaign.com\"],\"secretName\":\"iab\"}]},\"status\":{\"loadBalancer\":{\"ingress\":[{\"hostname\":\"a91db86aaa6a947ae8cf9a0ee09c740a-1073567115.ap-south-1.elb.amazonaws.com\"}]}}}\n"},"managedFields":[{"manager":"kubectl-client-side-apply","operation":"Update","apiVersion":"networking.k8s.io/v1","time":"2022-05-10T13:02:45Z","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:cert-manager.io/cluster-issuer":{},"f:kubectl.kubernetes.io/last-applied-configuration":{}}},"f:spec":{"f:ingressClassName":{},"f:rules":{},"f:tls":{}}}}]},"spec":{"ingressClassName":"nginx","tls":[{"hosts":["iab.steercampaign.com"],"secretName":"iab"}],"rules":[{"host":"iab.steercampaign.com","http":{"paths":[{"path":"/","pathType":"ImplementationSpecific","backend":{"service":{"name":"iab","port":{"number":80}}}}]}}]},"status":{"loadBalancer":{}}}') => {
      return {}
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .reply(201, (_, '{"apiVersion":"cert-manager.io/v1","kind":"Certificate","metadata":{"annotations":{"kubectl.kubernetes.io/last-applied-configuration":"{\"apiVersion\":\"cert-manager.io/v1\",\"kind\":\"Certificate\",\"metadata\":{\"annotations\":{},\"name\":\"iab\",\"namespace\":\"default\"},\"spec\":{\"dnsNames\":[\"iab.steercampaign.com\"],\"issuerRef\":{\"group\":\"cert-manager.io\",\"kind\":\"ClusterIssuer\",\"name\":\"letsencrypt-prod-ingress\"},\"secretName\":\"iab\"}}\n"},"creationTimestamp":"2022-05-10T13:02:45Z","generation":1,"managedFields":[{"apiVersion":"cert-manager.io/v1","fieldsType":"FieldsV1","fieldsV1":{"f:status":{"f:conditions":{"k:{\"type\":\"Ready\"}":{".":{},"f:lastTransitionTime":{},"f:message":{},"f:observedGeneration":{},"f:reason":{},"f:status":{},"f:type":{}}}}},"manager":"cert-manager-certificates-readiness","operation":"Update","subresource":"status","time":"2022-05-10T13:02:45Z"},{"apiVersion":"cert-manager.io/v1","fieldsType":"FieldsV1","fieldsV1":{"f:status":{".":{},"f:conditions":{".":{},"k:{\"type\":\"Issuing\"}":{".":{},"f:lastTransitionTime":{},"f:message":{},"f:observedGeneration":{},"f:reason":{},"f:status":{},"f:type":{}}}}},"manager":"cert-manager-certificates-trigger","operation":"Update","subresource":"status","time":"2022-05-10T13:02:45Z"},{"apiVersion":"cert-manager.io/v1","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:ownerReferences":{".":{},"k:{\"uid\":\"1f74d220-0d1c-4904-83a0-4a8e26867c34\"}":{}}},"f:spec":{".":{},"f:dnsNames":{},"f:issuerRef":{".":{},"f:group":{},"f:kind":{},"f:name":{}},"f:secretName":{},"f:usages":{}}},"manager":"cert-manager-ingress-shim","operation":"Update","time":"2022-05-10T13:02:45Z"},{"apiVersion":"cert-manager.io/v1","fieldsType":"FieldsV1","fieldsV1":{"f:status":{"f:nextPrivateKeySecretName":{}}},"manager":"cert-manager-certificates-key-manager","operation":"Update","subresource":"status","time":"2022-05-10T13:02:46Z"},{"apiVersion":"cert-manager.io/v1","fieldsType":"FieldsV1","fieldsV1":{"f:metadata":{"f:annotations":{".":{},"f:kubectl.kubernetes.io/last-applied-configuration":{}}}},"manager":"kubectl-client-side-apply","operation":"Update","time":"2022-05-10T13:04:02Z"}],"name":"iab","namespace":"default","ownerReferences":[{"apiVersion":"networking.k8s.io/v1","blockOwnerDeletion":true,"controller":true,"kind":"Ingress","name":"iab","uid":"1f74d220-0d1c-4904-83a0-4a8e26867c34"}],"resourceVersion":"3084819","uid":"da963171-d9ba-471f-8fa3-a0d7235dbdb9"},"spec":{"dnsNames":["iab.steercampaign.com"],"issuerRef":{"group":"cert-manager.io","kind":"ClusterIssuer","name":"letsencrypt-prod-ingress"},"secretName":"iab","usages":["digital signature","key encipherment"]},"status":{"conditions":[{"lastTransitionTime":"2022-05-10T13:02:45Z","message":"Issuing certificate as Secret does not exist","observedGeneration":1,"reason":"DoesNotExist","status":"True","type":"Issuing"},{"lastTransitionTime":"2022-05-10T13:02:45Z","message":"Issuing certificate as Secret does not exist","observedGeneration":1,"reason":"DoesNotExist","status":"False","type":"Ready"}],"nextPrivateKeySecretName":"iab-mf9rc"}}') => {
      return {}
    })
}

export function mockCreateKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .get('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithError('Kub8 Error')
    .post('/apis/apps/v1/namespaces/default/statefulsets')
    .replyWithError('Kub8 Error')
    .post('/api/v1/namespaces/default/services')
    .replyWithError('Kub8 Error')
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError('Kub8 Error')
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError('Kub8 Error')
}

export function mockDeleteKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .delete('/api/v1/namespaces/default/services/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .reply(201, (_, requestBody) => {
      return {}
    })
}

export function mockDeleteKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .delete('/apis/apps/v1/namespaces/default/statefulsets/iab')
    .replyWithError('Kub8 Error')
    .delete('/api/v1/namespaces/default/services/iab')
    .replyWithError('Kub8 Error')
    .delete('/apis/networking.k8s.io/v1/namespaces/default/ingresses/iab')
    .replyWithError('Kub8 Error')
    .delete('/apis/cert-manager.io/v1/namespaces/default/certificates/iab')
    .replyWithError('Kub8 Error')
}

export function mockSetDomainKubApi() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .reply(201, (_, requestBody) => {
      return {}
    })
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .reply(201, (_, requestBody) => {
      return {}
    })
}

export function mockSetDomainKubApiFailed() {
  return nock(`${process.env.K8S_API_URL}`)
    .post('/apis/networking.k8s.io/v1/namespaces/default/ingresses')
    .replyWithError('Kub8 Error')
    .post('/apis/cert-manager.io/v1/namespaces/default/certificates')
    .replyWithError('Kub8 Error')
}
