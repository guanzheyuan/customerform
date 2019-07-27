import request from '@/utils/request';

export async function queryAllGridList() {
  return request(`/ecogrid/grid/getAllGridList`, {
    method: 'get',
  });
}

export async function queryGridDetails(param) {
  return request(`/ecogrid/grid/getGridDetails/${param}`);
}

export async function queryGridCompanys(id, pageNum, pageSize) {
  return request(
    `/ecogrid/grid/getEnterpriseListByPage?id=${id}&pageNum=${pageNum}&pageSize=${pageSize}`
  );
}

export async function queryDefaultGrid() {
  return request(`/ecogrid/grid/getDefaultGird`);
}

export async function queryDefaultArea() {
  return request(`/ecogrid/grid/getGirdByLevelTwo`);
}

export async function queryDefaultCompany() {
  return request(`/ecogrid/grid/getGirdByLevelThree`);
}

export async function deleteTreeNode(param) {
  return request(`/ecogrid/grid/deleteGrid/${param}`);
}

export async function addGrid(param) {
  return request(`/ecogrid/grid/insertGrid`, {
    method: 'post',
    data: param,
  });
}

export async function updateGrid(param) {
  return request(`/ecogrid/grid/updateGrid`, {
    method: 'post',
    data: param,
  });
}

export async function getGridRespPerson() {
  return request(`/ecogrid/grid/getGridRespPerson`);
}
