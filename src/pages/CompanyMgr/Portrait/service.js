import request from '@/utils/request';

export async function queryEnterpriseinfo(param) {
  return request(`/entermgr/enterpriseinfo/detail/maininfo/${param}`);
}

export async function queryTablist() {
  return request('/entermgr/enterpriseinfo/detail/extends');
}

export async function queryTabdetail(param) {
  return request(`/entermgr/enterpriseinfo/detail/extinfo/${param}/1`);
}
