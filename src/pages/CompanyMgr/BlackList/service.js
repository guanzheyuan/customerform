import request from '@/utils/request';

export async function blackList(pageNum, pageSize, enterpriseName) {
  if (enterpriseName) {
    return request(
      `/entermgr/enterpriseblacklist/list?pageNum=${pageNum}&pageSize=${pageSize}&enterpriseName=${enterpriseName}`
    );
  }
  return request(`/entermgr/enterpriseblacklist/list?pageNum=${pageNum}&pageSize=${pageSize}`);
}

export async function removeBlackList(id) {
  return request(`/entermgr/enterpriseblacklist/${id}`, {
    method: 'DELETE',
  });
}
