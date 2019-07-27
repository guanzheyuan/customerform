import request from '@/utils/request';

export async function querySearchtype() {
  return request('/entermgr/enterpriseinfo/dict/searchtype/dyn');
}

export async function queryLablelist() {
  return request('/entermgr/emlabel/list/cond?labelStatus=1');
}

export async function queryEnterprise(pageNum, pageSize, searchParam) {
  return request(`/entermgr/enterpriseinfo/list/page?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'post',
    data: searchParam,
  });
}
