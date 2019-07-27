import request from '@/utils/request';

export async function queryLibrarylist(pageNum, pageSize, searchParam) {
  return request(
    `/entermgr/enterpriseinfo/dict/eps?pageNum=${pageNum}&pageSize=${pageSize}&searchParam=${searchParam}`
  );
}

export async function queryLablelist() {
  return request('/entermgr/emlabel/list/cond?labelStatus=1');
}
