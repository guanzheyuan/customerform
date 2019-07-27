import request from '@/utils/request';

export async function getElementDataSource() {
  return request(`/entermgr/epattrextlabeldisplay/getElementDataSource`);
}

export async function queryTablist() {
  return request('/entermgr/enterpriseinfo/detail/extends');
}
