import request from '@/utils/request';

export async function queryCreditList(pageNum, pageSize, searchParam) {
  return request(`/entermgr/enterprisecredit/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'get',
    params: searchParam,
  });
}

export async function queryRoleUser() {
  return request('/api/queryUserList');
}
