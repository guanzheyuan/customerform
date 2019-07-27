import request from '@/utils/request';

export async function queryTopGridList() {
  return request(`/ecorun/grid/list`, {
    method: 'get',
  });
}

export async function queryDownGridList() {
  return request(`/ecorun/jjyxprojectinfo/dict/status`, {
    method: 'get',
  });
}

export async function queryGrid(gridIdList, projectStatus) {
  return request(
    `/ecorun/jjyxprojectinfo/coordinates?gridIdList=${gridIdList}&projectStatusList=${projectStatus}`,
    {
      method: 'get',
    }
  );
}

export async function queryGridArea(gridIdList) {
  return request(`/ecorun/grid/map?gridIdList=${gridIdList}`, {
    method: 'get',
  });
}

export async function queryGridInfo(gridId) {
  return request(`/ecorun/jjyxprojectinfo/${gridId}`, {
    method: 'get',
  });
}
