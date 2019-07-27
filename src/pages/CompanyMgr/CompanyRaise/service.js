import request from '@/utils/request';

// 获取类别
export async function queryRaiseType() {
  return request('/entermgr/emcultivatedatabase/list', {
    method: 'get',
  });
}

// 获取统计信息
export async function getRaiseStatistic(id) {
  return request(`/entermgr/emcultivatedatabase/statistics/${id}`, {
    method: 'get',
  });
}

// 查询种子库企业列表-分页
export async function querySeedList(params) {
  return request(`/entermgr/emcultivateseedentpinfo/pagelist`, {
    method: 'get',
    params,
  });
}

// 查询培育企业列表-分页
export async function queryEntpList(params) {
  return request(`/entermgr/emcultivateentpinfo/pagelist`, {
    method: 'get',
    params,
  });
}

// 查询培育计划-分页
export async function queryPlanList(params) {
  return request(`/entermgr/emcultivateentpplan/pagelist`, {
    method: 'get',
    params,
  });
}

// 查询培育通知-分页
export async function queryNotiList(params) {
  return request(`/entermgr/emcultivateentpinform/pagelist`, {
    method: 'get',
    params,
  });
}

// 企业列表-培育成功
export async function updateEntp(params) {
  return request(`/entermgr/emcultivateentpinfo/update`, {
    method: 'patch',
    data: {
      ...params,
    },
  });
}
// 企业列表-移除
export async function deleteEntp(id) {
  return request(`/entermgr/emcultivateentpinfo/${id}`, {
    method: 'delete',
  });
}

// 种子库-加入培育库
export async function addSeedToCul(id) {
  return request(`/entermgr/emcultivateseedentpinfo/tocultivate/${id}`, {
    method: 'post',
  });
}

// 种子库-移除
export async function deleteSeed(id) {
  return request(`/entermgr/emcultivateseedentpinfo/${id}`, {
    method: 'delete',
  });
}

// 种子库-批量更新
export async function updateMutiSeed(params) {
  return request(`/entermgr/emcultivateseedentpinfo/batchupdate`, {
    method: 'post',
    data: params,
  });
}

// 种子库-更新
export async function updateSeed(params) {
  return request(`/entermgr/emcultivateseedentpinfo/update`, {
    method: 'patch',
    data: {
      ...params,
    },
  });
}
