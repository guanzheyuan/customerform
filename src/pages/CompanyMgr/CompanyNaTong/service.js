import request from '@/utils/request';

export async function queryNaTongTabs() {
  return request(`/entermgr/eminstatdatabase/classify`, {
    method: 'get',
  });
}

export async function queryNaTongTabelList(pageNum, pageSize, databaseId, enterpriseName) {
  if (enterpriseName) {
    return request(
      `/entermgr/eminstatentpinfo/page?pageNum=${pageNum}&pageSize=${pageSize}&databaseId=${databaseId}&enterpriseName=${enterpriseName}`
    );
  }
  return request(
    `/entermgr/eminstatentpinfo/page?pageNum=${pageNum}&pageSize=${pageSize}&databaseId=${databaseId}`
  );
}

export async function querySeedTabelList(pageNum, pageSize, enterpriseName) {
  if (enterpriseName) {
    return request(
      `/entermgr/eminstatseedentpinfo/page?pageNum=${pageNum}&pageSize=${pageSize}&enterpriseName=${enterpriseName}`
    );
  }
  return request(`/entermgr/eminstatseedentpinfo/page?pageNum=${pageNum}&pageSize=${pageSize}`);
}

export async function queryDeleteNaTong(id) {
  return request(`/entermgr/eminstatentpinfo/${id}`, {
    method: 'patch',
  });
}

export async function queryAddNaTong(id, typeId) {
  return request(`/entermgr/eminstatseedentpinfo/${id}/${typeId}`, {
    method: 'put',
  });
}

export async function queryDeleteSeed(id) {
  return request(`/entermgr/eminstatseedentpinfo/${id}`, {
    method: 'patch',
  });
}

export async function queryInfoDatas(id) {
  return request(`/entermgr/eminstatentpdashboard/info/${id}`, {
    method: 'get',
  });
}
