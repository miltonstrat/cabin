/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import BaseApi from './BaseApi';

class ClustersApi {

  static checkCluster(cluster) {
    return BaseApi.get(`${cluster.get('url')}/api/v1`, {}, cluster)
      .then(() => Promise.resolve(true))
      .catch(() => Promise.resolve(false));
  }

  static fetchNamespaces(cluster) {
    return BaseApi.get('/api/v1/namespaces', {}, cluster).then(response => {
      return response.get('items').map(namespace => namespace.getIn(['metadata', 'name']));
    });
  }

  /* PODS */
  static fetchPods(cluster) {
    return BaseApi.get('/pods', {}, cluster).then(response => {
      return response.get('items');
    });
  }

  static deletePod({cluster, pod}) {
    return BaseApi.delete(`/pods/${pod.getIn(['metadata', 'name'])}`, {}, cluster);
  }

  static addPodLabel({cluster, pod, key, value}) {
    const body = {metadata: {
      labels: pod.getIn(['metadata', 'labels'], Immutable.Map()).set(key, value).toJS(),
    }};
    return BaseApi.patch(`/pods/${pod.getIn(['metadata', 'name'])}`, body, cluster);
  }

  static deletePodLabel({cluster, pod, key}) {
    const body = {metadata: {
      labels: pod.getIn(['metadata', 'labels'], Immutable.Map()).remove(key).toJS(),
    }};
    return BaseApi.patch(`/pods/${pod.getIn(['metadata', 'name'])}`, body, cluster);
  }

  /* RC */
  static fetchReplications(cluster) {
    return BaseApi.get('/replicationcontrollers', {}, cluster).then(response => {
      return response.get('items');
    });
  }

  /* SERVICES */
  static fetchServices(cluster) {
    return BaseApi.get('/services', {}, cluster).then(response => {
      return response.get('items');
    });
  }

}

export default ClustersApi;